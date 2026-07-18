import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, setFilters, setPage, removeTransaction } from "../store/slices/transactionSlice";
import TransactionModal from "../components/transactions/TransactionModal";
import toast from "react-hot-toast";

const Transactions = () => {
  const dispatch = useDispatch();
  const { items, pagination, filters, loading } = useSelector(state => state.transactions);
  const { items: categories } = useSelector((state) => state.categories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Debounce search
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
        dispatch(setPage(1));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, filters.search, dispatch]);

  useEffect(() => {
    dispatch(fetchTransactions({
      page: pagination.page,
      limit: 10,
      search: filters.search,
      type: filters.type,
      category: filters.category,
      sort: filters.sort,
      paymentMethod: filters.paymentMethod,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount
    }));
  }, [dispatch, pagination.page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
    dispatch(setPage(1));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const result = await dispatch(removeTransaction(id));
      if (!result.error) {
        toast.success("Transaction deleted successfully!");
      } else {
        toast.error(result.payload?.message || result.error?.message || "Failed to delete transaction");
      }
    }
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your income and expenses.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20 active:scale-95 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Transaction
        </button>
      </div>

      {/* Controls: Search & Filters */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 backdrop-blur-sm">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-slate-500"
          />
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="" className="bg-[#11111a]">All Types</option>
            <option value="income" className="bg-[#11111a]">Income</option>
            <option value="expense" className="bg-[#11111a]">Expense</option>
          </select>

          <select 
            name="category" 
            value={filters.category || ""} 
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="" className="bg-[#11111a]">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name} className="bg-[#11111a]">
                {cat.name}
              </option>
            ))}
          </select>

          <select 
            name="sort" 
            value={filters.sort} 
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="newest" className="bg-[#11111a]">Newest First</option>
            <option value="oldest" className="bg-[#11111a]">Oldest First</option>
            <option value="highest" className="bg-[#11111a]">Highest Amount</option>
            <option value="lowest" className="bg-[#11111a]">Lowest Amount</option>
          </select>

          <select 
            name="paymentMethod" 
            value={filters.paymentMethod || ""} 
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="" className="bg-[#11111a]">Any Payment</option>
            <option value="Cash" className="bg-[#11111a]">Cash</option>
            <option value="Card" className="bg-[#11111a]">Card</option>
            <option value="UPI" className="bg-[#11111a]">UPI</option>
            <option value="Bank Transfer" className="bg-[#11111a]">Bank Transfer</option>
          </select>
          
          <input 
            type="number"
            name="minAmount"
            placeholder="Min ₹"
            value={filters.minAmount || ""}
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-24 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-slate-500"
          />
          <input 
            type="number"
            name="maxAmount"
            placeholder="Max ₹"
            value={filters.maxAmount || ""}
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-24 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-slate-400">No transactions found.</p>
                  </td>
                </tr>
              ) : (
                items.map((t) => (
                  <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${t.type === "income" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.type === "income" ? "bg-emerald-400" : "bg-rose-400"}`} />
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{t.title}</div>
                      {t.description && <div className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{t.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {t.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${t.type === "income" ? "text-emerald-400" : "text-white"}`}>
                        {t.type === "income" ? "+" : ""}₹{t.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {formatDate(t.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">{((pagination.page - 1) * 10) + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.page * 10, pagination.totalCount)}</span> of <span className="font-medium text-white">{pagination.totalCount}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch(setPage(pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => dispatch(setPage(pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={transactionToEdit} 
      />
    </div>
  );
};

export default Transactions;
