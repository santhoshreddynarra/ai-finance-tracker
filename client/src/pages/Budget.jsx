import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget, upsertBudget } from "../store/slices/budgetSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchTransactions } from "../store/slices/transactionSlice";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const Budget = () => {
  const dispatch = useDispatch();
  const { data: budgetData, loading: budgetLoading } = useSelector((state) => state.budget);
  const { items: categories, loading: catLoading } = useSelector((state) => state.categories);
  const { items: transactions, loading: transLoading } = useSelector((state) => state.transactions);

  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  
  const [mainBudget, setMainBudget] = useState("");
  const [catForm, setCatForm] = useState({ category: "", limit: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBudget());
    dispatch(fetchCategories());
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    dispatch(fetchTransactions({ startDate: firstDay, endDate: lastDay, limit: 1000 }));
  }, [dispatch]);

  const loading = budgetLoading || catLoading || transLoading;
  const expenseCategories = categories.filter(c => c.type === "expense");

  // Calculate spent amounts per category
  const spentPerCategory = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  const totalSpent = Object.values(spentPerCategory).reduce((a, b) => a + b, 0);

  const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  const handleMainBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!mainBudget || Number(mainBudget) < 0) {
      setError("Please enter a valid monthly budget");
      return;
    }
    
    setSubmitting(true);
    const result = await dispatch(upsertBudget({ 
      monthlyBudget: Number(mainBudget), 
      categoryBudgets: budgetData.categoryBudgets 
    }));
    setSubmitting(false);

    if (!result.error) setIsMainModalOpen(false);
    else setError(result.payload || "Error updating budget");
  };

  const handleCatBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!catForm.category || !catForm.limit || Number(catForm.limit) <= 0) {
      setError("Valid category and limit are required");
      return;
    }
    
    // Check if category already exists in budgets
    let updatedCatBudgets = [...(budgetData.categoryBudgets || [])];
    const existingIndex = updatedCatBudgets.findIndex(cb => cb.category === catForm.category);
    
    if (existingIndex >= 0) {
      updatedCatBudgets[existingIndex] = { category: catForm.category, limit: Number(catForm.limit) };
    } else {
      updatedCatBudgets.push({ category: catForm.category, limit: Number(catForm.limit) });
    }

    setSubmitting(true);
    const result = await dispatch(upsertBudget({ 
      monthlyBudget: budgetData.monthlyBudget, 
      categoryBudgets: updatedCatBudgets 
    }));
    setSubmitting(false);

    if (!result.error) setIsCatModalOpen(false);
    else setError(result.payload || "Error updating category budget");
  };

  const deleteCatBudget = async (categoryName) => {
    if (!window.confirm(`Remove budget for ${categoryName}?`)) return;
    
    const updatedCatBudgets = budgetData.categoryBudgets.filter(cb => cb.category !== categoryName);
    await dispatch(upsertBudget({
      monthlyBudget: budgetData.monthlyBudget,
      categoryBudgets: updatedCatBudgets
    }));
  };

  const openMainModal = () => {
    setMainBudget(budgetData.monthlyBudget || "");
    setError("");
    setIsMainModalOpen(true);
  };

  const openCatModal = (cb = null) => {
    if (cb) {
      setCatForm({ category: cb.category, limit: cb.limit });
    } else {
      setCatForm({ category: expenseCategories[0]?.name || "", limit: "" });
    }
    setError("");
    setIsCatModalOpen(true);
  };

  return (
    <div className="space-y-6 relative max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Budgets</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your overall and categorical spending limits.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Main Monthly Budget Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-1">Total Monthly Budget</h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-violet-400">{formatCurrency(budgetData.monthlyBudget)}</span>
                  <span className="text-sm text-slate-400">limit</span>
                </div>
                
                {budgetData.monthlyBudget > 0 ? (
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between text-sm">
                      <span className="text-slate-300">{formatCurrency(totalSpent)} spent</span>
                      <span className="text-slate-400">{formatCurrency(Math.max(0, budgetData.monthlyBudget - totalSpent))} remaining</span>
                    </div>
                    <div className="overflow-hidden h-3 flex rounded-full bg-white/10">
                      <div 
                        style={{ width: `${Math.min((totalSpent / budgetData.monthlyBudget) * 100, 100)}%` }} 
                        className={`shadow-none flex flex-col justify-center transition-all ${totalSpent > budgetData.monthlyBudget ? 'bg-rose-500' : 'bg-violet-500'}`}
                      ></div>
                    </div>
                    {totalSpent > budgetData.monthlyBudget && (
                      <p className="text-rose-400 text-xs mt-2 font-medium">You have exceeded your overall monthly budget!</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Set a monthly budget to track your overall spending.</p>
                )}
              </div>
              
              <div className="md:border-l md:border-white/10 md:pl-8 md:ml-4 flex items-center">
                <Button onClick={openMainModal} className="w-full md:w-auto px-6 shadow-lg shadow-violet-500/20">
                  {budgetData.monthlyBudget > 0 ? "Edit Budget" : "Set Monthly Budget"}
                </Button>
              </div>
            </div>
          </div>

          {/* Category Budgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Category Budgets</h2>
              <button 
                onClick={() => openCatModal()}
                className="text-sm text-violet-400 hover:text-violet-300 font-medium"
              >
                + Add Category Budget
              </button>
            </div>

            {(!budgetData.categoryBudgets || budgetData.categoryBudgets.length === 0) ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
                <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-white font-medium mb-1">No category limits set</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">Set specific limits for categories like Food, Travel, etc., to maintain strict control over your spending.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgetData.categoryBudgets.map((cb, idx) => {
                  const spent = spentPerCategory[cb.category] || 0;
                  const percentage = Math.min((spent / cb.limit) * 100, 100);
                  const isOver = spent > cb.limit;

                  return (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-lg hover:bg-white/[0.06] transition-colors group relative">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-semibold">{cb.category}</h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openCatModal(cb)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => deleteCatBudget(cb.category)} className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-red-500/10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <span className="text-xl font-bold text-white">{formatCurrency(spent)}</span>
                        <span className="text-xs text-slate-400 mb-1">of {formatCurrency(cb.limit)}</span>
                      </div>

                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full transition-all ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className={isOver ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                          {isOver ? 'Over budget' : `${formatCurrency(cb.limit - spent)} left`}
                        </span>
                        <span className="text-slate-500 font-medium">{percentage.toFixed(0)}% used</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Budget Modal */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMainModalOpen(false)} />
          <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Overall Monthly Budget</h2>
            <form id="main-budget-form" onSubmit={handleMainBudgetSubmit}>
              <InputField
                id="mainBudget"
                label="Amount (₹)"
                type="number"
                value={mainBudget}
                onChange={(e) => setMainBudget(e.target.value)}
                min="0"
                placeholder="e.g. 50000"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsMainModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
              <Button form="main-budget-form" type="submit" loading={submitting}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Budget Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
          <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Category Limit</h2>
            <form id="cat-budget-form" onSubmit={handleCatBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select 
                  value={catForm.category}
                  onChange={(e) => setCatForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-violet-500/50"
                >
                  <option value="" disabled>Select category</option>
                  {expenseCategories.map(c => (
                    <option key={c._id} value={c.name} className="bg-[#11111a]">{c.name}</option>
                  ))}
                </select>
              </div>
              <InputField
                id="catLimit"
                label="Limit Amount (₹)"
                type="number"
                value={catForm.limit}
                onChange={(e) => setCatForm(prev => ({ ...prev, limit: e.target.value }))}
                min="1"
                placeholder="e.g. 5000"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </form>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
              <Button form="cat-budget-form" type="submit" loading={submitting}>Save</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Budget;
