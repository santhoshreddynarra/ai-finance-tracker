import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory, removeCategory, editCategory } from "../store/slices/categorySlice";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const Categories = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [form, setForm] = useState({ name: "", type: "expense" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", type: "expense" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name, type: category.type });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(removeCategory(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }
    
    setSubmitting(true);
    let result;
    if (editingCategory) {
      result = await dispatch(editCategory({ id: editingCategory._id, formData: form }));
    } else {
      result = await dispatch(addCategory(form));
    }
    setSubmitting(false);

    if (!result.error) {
      setIsModalOpen(false);
    } else {
      setError(result.payload || "An error occurred");
    }
  };

  const incomeCategories = items.filter(c => c.type === "income");
  const expenseCategories = items.filter(c => c.type === "expense");

  const CategoryList = ({ categories, title }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/10">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      {categories.length === 0 ? (
        <p className="text-slate-400 text-sm">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
              <div>
                <h3 className="text-white font-medium">{c.name}</h3>
                {c.isDefault && <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block">Default</span>}
              </div>
              {!c.isDefault && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(c)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your income and expense categories.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20 active:scale-95 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <CategoryList categories={expenseCategories} title="Expense Categories" />
          <CategoryList categories={incomeCategories} title="Income Categories" />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editingCategory ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, type: "expense" }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === "expense" ? "bg-rose-500/20 text-rose-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, type: "income" }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === "income" ? "bg-emerald-500/20 text-emerald-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
                  >
                    Income
                  </button>
                </div>
                
                <InputField
                  id="name"
                  label="Category Name"
                  placeholder="e.g., Grocery"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
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
              <Button form="category-form" type="submit" loading={submitting} className="w-auto px-6">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
