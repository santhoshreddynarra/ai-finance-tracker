import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgets, upsertBudget, removeBudget } from "../store/slices/budgetSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchTransactions } from "../store/slices/transactionSlice";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const Budget = () => {
  const dispatch = useDispatch();
  const { items: budgets, loading: budgetLoading } = useSelector((state) => state.budgets);
  const { items: categories, loading: catLoading } = useSelector((state) => state.categories);
  const { items: transactions, loading: transLoading } = useSelector((state) => state.transactions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ category: "", amount: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchCategories());
    // Fetch all transactions for the current month to calculate progress
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    dispatch(fetchTransactions({ startDate: firstDay, endDate: lastDay, limit: 1000 }));
  }, [dispatch]);

  const loading = budgetLoading || catLoading || transLoading;

  const expenseCategories = categories.filter(c => c.type === "expense");

  const openAddModal = () => {
    setForm({ category: expenseCategories[0]?.name || "", amount: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setForm({ category: budget.category, amount: budget.amount });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this budget?")) {
      dispatch(removeBudget(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || Number(form.amount) <= 0) {
      setError("Valid category and amount are required");
      return;
    }
    
    setSubmitting(true);
    const result = await dispatch(upsertBudget(form));
    setSubmitting(false);

    if (!result.error) {
      setIsModalOpen(false);
    } else {
      setError(result.payload || "An error occurred");
    }
  };

  // Calculate spent amounts per category
  const spentPerCategory = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Monthly Budgets</h1>
          <p className="text-slate-400 text-sm mt-1">Set limits and track your spending.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20 active:scale-95 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Set Budget
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Budgets Set</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Create a budget for your expense categories to keep your spending in check.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const spent = spentPerCategory[b.category] || 0;
            const percentage = Math.min((spent / b.amount) * 100, 100);
            const isOverBudget = spent > b.amount;
            
            return (
              <div key={b._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:bg-white/[0.06] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{b.category}</h3>
                    <p className="text-sm text-slate-400 mt-1">₹{spent.toLocaleString("en-IN")} of ₹{b.amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(b)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${isOverBudget ? 'text-rose-400 bg-rose-500/20' : 'text-emerald-400 bg-emerald-500/20'}`}>
                        {isOverBudget ? 'Over Budget' : `${percentage.toFixed(0)}%`}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    ></div>
                  </div>
                  {b.amount - spent > 0 && (
                    <p className="text-xs text-slate-400">₹{(b.amount - spent).toLocaleString("en-IN")} remaining</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Budget Settings</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <form id="budget-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    <option value="" disabled>Select category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat._id} value={cat.name} className="bg-[#11111a]">{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <InputField
                  id="amount"
                  label="Budget Amount (₹)"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  min="1"
                />
                
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 bg-white/[0.01]">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <Button form="budget-form" type="submit" loading={submitting} className="w-auto px-6">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
