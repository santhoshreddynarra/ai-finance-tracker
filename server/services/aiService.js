import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import OpenAI from "openai";

// Try initializing OpenAI if key is present
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ── Helper to calculate basic stats for local heuristics ────────────────
const calculateStats = (transactions, currentMonthStart, previousMonthStart) => {
  let currIncome = 0;
  let currExpense = 0;
  let prevIncome = 0;
  let prevExpense = 0;
  let categoryTotals = {};
  
  const biggestExpenses = [];

  transactions.forEach((t) => {
    const isCurrent = t.transactionDate >= currentMonthStart;
    const isPrev = t.transactionDate >= previousMonthStart && t.transactionDate < currentMonthStart;

    if (isCurrent) {
      if (t.type === "income") currIncome += t.amount;
      else {
        currExpense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        biggestExpenses.push(t);
      }
    } else if (isPrev) {
      if (t.type === "income") prevIncome += t.amount;
      else prevExpense += t.amount;
    }
  });

  // Sort biggest expenses
  biggestExpenses.sort((a, b) => b.amount - a.amount);

  return {
    currIncome,
    currExpense,
    prevIncome,
    prevExpense,
    currSavings: currIncome - currExpense,
    prevSavings: prevIncome - prevExpense,
    categoryTotals,
    top5Expenses: biggestExpenses.slice(0, 5),
  };
};

const getLocalInsights = (stats, budget) => {
  const { currIncome, currExpense, prevIncome, prevExpense, currSavings, prevSavings, categoryTotals } = stats;
  
  const monthlyBudget = budget?.monthlyBudget || 0;
  
  // Top category
  let topCategory = "None";
  let topCatAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topCatAmount) {
      topCategory = cat;
      topCatAmount = amt;
    }
  }

  // Budget Health & Score Calculation
  let score = 100;
  let budgetHealth = "Excellent";
  const expenseRatio = currIncome > 0 ? (currExpense / currIncome) : 1;
  const budgetRatio = monthlyBudget > 0 ? (currExpense / monthlyBudget) : 0;
  
  if (budgetRatio > 1) {
    score -= 30;
    budgetHealth = "Critical";
  } else if (budgetRatio > 0.8) {
    score -= 15;
    budgetHealth = "Warning";
  }

  if (currSavings <= 0) score -= 20;
  if (expenseRatio > 0.8) score -= 10;
  if (topCatAmount > currExpense * 0.5) score -= 10; // low diversity
  
  score = Math.max(0, Math.min(100, score));

  let scoreDescription = "Excellent";
  if (score < 50) scoreDescription = "Critical";
  else if (score < 70) scoreDescription = "Needs Improvement";
  else if (score < 85) scoreDescription = "Good";

  // Forecast
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const runRate = currentDay > 0 ? (currExpense / currentDay) : 0;
  const forecastAmount = Math.round(runRate * daysInMonth);
  let budgetRisk = "Safe";
  if (monthlyBudget > 0 && forecastAmount > monthlyBudget) budgetRisk = "High Risk";
  else if (monthlyBudget > 0 && forecastAmount > monthlyBudget * 0.9) budgetRisk = "Warning";

  // Smart Insights & Recommendations
  const smartInsights = [];
  const personalizedRecommendations = [];

  if (topCategory !== "None") {
    smartInsights.push(`You spent ${((topCatAmount/currExpense)*100).toFixed(0)}% of your expenses on ${topCategory}.`);
    if ((topCatAmount/currExpense) > 0.4) {
      personalizedRecommendations.push(`Review your ${topCategory} expenses; it makes up a large portion of your spending.`);
    }
  }

  if (currSavings > prevSavings) {
    smartInsights.push(`You saved more this month compared to last month.`);
  } else if (currSavings < prevSavings && currSavings > 0) {
    smartInsights.push(`Your savings are lower than last month.`);
    personalizedRecommendations.push(`Try to increase your savings back to last month's level.`);
  }

  if (budgetRatio > 0.9) {
    smartInsights.push(`You are close to exceeding your monthly budget.`);
    personalizedRecommendations.push(`Reduce non-essential spending for the rest of the month.`);
  }

  if (personalizedRecommendations.length === 0) {
    personalizedRecommendations.push("Keep up the good financial habits!");
    personalizedRecommendations.push("Consider investing your surplus savings.");
  }

  // Monthly Comparison
  const incomeDiff = currIncome - prevIncome;
  const expenseDiff = currExpense - prevExpense;
  const savingsDiff = currSavings - prevSavings;

  return {
    provider: "Local Analysis",
    financialScore: {
      score,
      description: scoreDescription,
    },
    spendingSummary: {
      totalIncome: currIncome,
      totalExpense: currExpense,
      totalSavings: currSavings,
    },
    monthlyComparison: {
      incomeDifference: incomeDiff,
      expenseDifference: expenseDiff,
      savingsDifference: savingsDiff,
    },
    topCategory: {
      category: topCategory,
      amount: topCatAmount,
    },
    budgetHealth,
    expenseForecast: {
      forecastAmount,
      budgetRisk,
    },
    smartInsights,
    personalizedRecommendations,
  };
};

// ── Main Service Method ──────────────────────────────────────────────────
export const getFinancialInsights = async (userId) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  // Fetch data
  const transactions = await Transaction.find({ 
    userId, 
    transactionDate: { $gte: previousMonthStart } 
  });
  
  const budget = await Budget.findOne({ userId });

  // Calculate base stats
  const stats = calculateStats(transactions, currentMonthStart, previousMonthStart);
  
  // If no OpenAI key, use local heuristic
  if (!openai) {
    const localInsights = getLocalInsights(stats, budget);
    return { ...localInsights, biggestExpenses: stats.top5Expenses };
  }

  // If OpenAI key exists, generate advanced insights
  try {
    const prompt = `
      Act as an expert financial advisor. Analyze the following user data and provide structured insights.
      Current Month Income: ${stats.currIncome}
      Current Month Expense: ${stats.currExpense}
      Previous Month Income: ${stats.prevIncome}
      Previous Month Expense: ${stats.prevExpense}
      Monthly Budget: ${budget?.monthlyBudget || 'Not set'}
      Category Totals this month: ${JSON.stringify(stats.categoryTotals)}
      
      Respond STRICTLY with a valid JSON object using this structure:
      {
        "financialScore": { "score": Number (0-100), "description": "Excellent|Good|Needs Improvement|Critical" },
        "budgetHealth": "String (e.g. Excellent, Warning, Critical)",
        "expenseForecast": { "forecastAmount": Number, "budgetRisk": "Safe|Warning|High Risk" },
        "smartInsights": ["String", "String", ...],
        "personalizedRecommendations": ["String", "String", ...]
      }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiData = JSON.parse(response.choices[0].message.content);

    // Merge AI data with exact stats for comparison
    return {
      provider: "OpenAI",
      spendingSummary: {
        totalIncome: stats.currIncome,
        totalExpense: stats.currExpense,
        totalSavings: stats.currSavings,
      },
      monthlyComparison: {
        incomeDifference: stats.currIncome - stats.prevIncome,
        expenseDifference: stats.currExpense - stats.prevExpense,
        savingsDifference: stats.currSavings - stats.prevSavings,
      },
      topCategory: {
        category: Object.keys(stats.categoryTotals).reduce((a, b) => stats.categoryTotals[a] > stats.categoryTotals[b] ? a : b, "None"),
        amount: Math.max(...Object.values(stats.categoryTotals), 0),
      },
      biggestExpenses: stats.top5Expenses,
      financialScore: aiData.financialScore,
      budgetHealth: aiData.budgetHealth,
      expenseForecast: aiData.expenseForecast,
      smartInsights: aiData.smartInsights,
      personalizedRecommendations: aiData.personalizedRecommendations,
    };
  } catch (error) {
    console.error("OpenAI API failed, falling back to local analysis:", error);
    const localInsights = getLocalInsights(stats, budget);
    return { ...localInsights, biggestExpenses: stats.top5Expenses, provider: "Local Analysis (Fallback)" };
  }
};
