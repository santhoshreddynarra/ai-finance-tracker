import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAiInsights } from "../store/slices/aiSlice";

const AIInsights = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(fetchAiInsights());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-violet-400 font-medium">Analyzing your finances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl max-w-md mx-auto text-center">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 underline text-sm">Retry</button>
      </div>
    );
  }

  const {
    provider,
    financialScore,
    spendingSummary,
    monthlyComparison,
    expenseForecast,
    smartInsights,
    personalizedRecommendations,
    biggestExpenses,
    topCategory
  } = data;

  const formatCurrency = (val) => `₹${Math.abs(Number(val)).toLocaleString("en-IN")}`;
  
  // Score Ring Calculation
  const scoreValue = financialScore?.score || 0;
  const strokeDasharray = 283; // 2 * pi * r (r=45)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * scoreValue) / 100;
  
  let scoreColor = "text-emerald-400";
  let ringColor = "stroke-emerald-400";
  if (scoreValue < 50) { scoreColor = "text-rose-400"; ringColor = "stroke-rose-400"; }
  else if (scoreValue < 70) { scoreColor = "text-fuchsia-400"; ringColor = "stroke-fuchsia-400"; }
  else if (scoreValue < 85) { scoreColor = "text-violet-400"; ringColor = "stroke-violet-400"; }

  return (
    <div className="space-y-8 pb-12 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            AI Financial Intelligence
            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Deep analysis of your spending patterns and financial health.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm self-start md:self-auto">
          <div className={`w-2 h-2 rounded-full animate-pulse ${provider.includes("OpenAI") ? "bg-emerald-400" : "bg-violet-400"}`} />
          <span className="text-xs font-medium text-slate-300">
            Powered by <span className={provider.includes("OpenAI") ? "text-emerald-400" : "text-violet-400"}>{provider}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h3 className="text-slate-300 font-semibold mb-6 z-10">Financial Health Score</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center z-10">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-white/10" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                className={`${ringColor} transition-all duration-1000 ease-out`} 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{scoreValue}</span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          
          <div className="mt-6 z-10">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${ringColor.replace('stroke', 'text')} bg-white/5`}>
              {financialScore?.description || "Calculating"}
            </div>
          </div>
        </div>

        {/* Expense Forecast & Monthly Comparison */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Forecast */}
          <div className="bg-gradient-to-br from-[#1c1c28] to-[#151520] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-3xl rounded-full" />
            <h3 className="text-slate-300 font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Month-End Forecast
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-1">Expected Total Expenses</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(expenseForecast?.forecastAmount || 0)}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 mt-auto">
              <span className="text-sm text-slate-400">Budget Risk</span>
              <span className={`text-sm font-semibold ${expenseForecast?.budgetRisk === 'Safe' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {expenseForecast?.budgetRisk || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-slate-300 font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              vs Previous Month
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Income</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${monthlyComparison?.incomeDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {monthlyComparison?.incomeDifference >= 0 ? '↑' : '↓'} {formatCurrency(monthlyComparison?.incomeDifference || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Expenses</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${monthlyComparison?.expenseDifference <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {monthlyComparison?.expenseDifference > 0 ? '↑' : '↓'} {formatCurrency(monthlyComparison?.expenseDifference || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Savings</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${monthlyComparison?.savingsDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {monthlyComparison?.savingsDifference >= 0 ? '↑' : '↓'} {formatCurrency(monthlyComparison?.savingsDifference || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-2 flex items-center gap-2">
            Smart Insights
          </h2>
          {smartInsights && smartInsights.length > 0 ? (
            smartInsights.map((insight, idx) => (
              <div key={idx} className="bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-4 flex gap-4 items-start hover:border-violet-500/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
              </div>
            ))
          ) : (
             <p className="text-slate-500 text-sm">Not enough data for insights.</p>
          )}
        </div>

        {/* Personalized Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-2 flex items-center gap-2">
            Action Plan
          </h2>
          {personalizedRecommendations && personalizedRecommendations.length > 0 ? (
            personalizedRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex gap-4 items-start hover:border-emerald-500/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No specific recommendations at this time.</p>
          )}
        </div>
      </div>

      {/* Biggest Expenses */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight mb-4">Biggest Expenses This Month</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {biggestExpenses && biggestExpenses.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {biggestExpenses.map((txn, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{txn.title}</p>
                        <p className="text-xs text-slate-500">{txn.category}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(txn.transactionDate).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric'})}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-white">
                        {formatCurrency(txn.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">No expenses logged this month.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
