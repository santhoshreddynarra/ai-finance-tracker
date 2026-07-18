import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, editTransaction } from "../../store/slices/transactionSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import toast from "react-hot-toast";


const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer"
];

const TransactionModal = ({ isOpen, onClose, transactionToEdit }) => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  
  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (transactionToEdit) {
      setForm({
        ...transactionToEdit,
        transactionDate: new Date(transactionToEdit.transactionDate).toISOString().split("T")[0]
      });
    } else {
      setForm(prev => {
        const currentTypeCategories = categories.filter(c => c.type === prev.type);
        return {
          ...prev,
          category: prev.category || (currentTypeCategories.length > 0 ? currentTypeCategories[0].name : "")
        };
      });
    }
    setErrors({});
  }, [transactionToEdit, isOpen, categories]);

  useEffect(() => {
    if (!isOpen && !transactionToEdit) {
      setForm({
        type: "expense",
        title: "",
        amount: "",
        category: "",
        paymentMethod: "Cash",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, transactionToEdit]);

  if (!isOpen) return null;

  const currentTypeCategories = categories.filter(c => c.type === form.type);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = "Enter a valid positive amount";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.paymentMethod) newErrors.paymentMethod = "Payment method is required";
    if (!form.transactionDate) newErrors.transactionDate = "Date is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    let result;
    if (transactionToEdit) {
      result = await dispatch(editTransaction({ id: transactionToEdit._id, formData: form }));
    } else {
      result = await dispatch(addTransaction(form));
    }
    setLoading(false);

    if (!result.error) {
      toast.success(transactionToEdit ? "Transaction updated successfully!" : "Transaction added successfully!");
      onClose();
    } else {
      toast.error(result.payload?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {transactionToEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Type toggle */}
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, type: "expense", category: categories.find(c => c.type === "expense")?.name || "" }));
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === "expense" ? "bg-rose-500/20 text-rose-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, type: "income", category: categories.find(c => c.type === "income")?.name || "" }));
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === "income" ? "bg-emerald-500/20 text-emerald-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                Income
              </button>
            </div>

            <InputField
              id="title"
              label="Title"
              placeholder="e.g., Grocery, Salary"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
            />

            <InputField
              id="amount"
              label="Amount (₹)"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              error={errors.amount}
              step="0.01"
              min="0"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  <option value="" disabled>Select category</option>
                  {currentTypeCategories.map(cat => <option key={cat._id} value={cat.name} className="bg-[#11111a]">{cat.name}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Payment Method</label>
                <select 
                  name="paymentMethod" 
                  value={form.paymentMethod} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  {PAYMENT_METHODS.map(pm => <option key={pm} value={pm} className="bg-[#11111a]">{pm}</option>)}
                </select>
                {errors.paymentMethod && <p className="text-red-400 text-xs mt-1">{errors.paymentMethod}</p>}
              </div>
            </div>

            <InputField
              id="transactionDate"
              label="Date"
              type="date"
              value={form.transactionDate}
              onChange={handleChange}
              error={errors.transactionDate}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="2"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                placeholder="Add some notes..."
              ></textarea>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 bg-white/[0.01]">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <Button 
            form="transaction-form" 
            type="submit" 
            loading={loading} 
            className="w-auto px-6"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
