import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6"];

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        const res = await api.get(`/reports?startDate=${startDate}&endDate=${endDate}`);
        setReportData(res.data.data);
      } catch (error) {
        console.error("Failed to load reports", error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [month, year]);

  const handleDownload = async (format) => {
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);
    try {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      
      const res = await api.get(`/reports/download?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial_report_${month+1}_${year}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success(`${format.toUpperCase()} downloaded successfully!`, { id: toastId });
    } catch (error) {
      console.error("Failed to download report", error);
      toast.error("Failed to download report", { id: toastId });
    }
  };

  const formatCurrency = (val) => `₹${Math.abs(Number(val)).toLocaleString("en-IN")}`;

  // Chart transformations
  let categoryData = [];
  let dailyData = [];

  if (reportData && reportData.transactions) {
    const catMap = {};
    const dayMap = {};
    
    reportData.transactions.forEach(t => {
      if (t.type === "expense") {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
      const day = new Date(t.transactionDate).getDate();
      if (!dayMap[day]) dayMap[day] = { day, income: 0, expense: 0 };
      if (t.type === "income") dayMap[day].income += t.amount;
      else dayMap[day].expense += t.amount;
    });

    categoryData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
    
    for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
      dailyData.push(dayMap[i] || { day: i, income: 0, expense: 0 });
    }
  }

  return (
    <div className="space-y-6 pb-12 relative max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports Center</h1>
          <p className="text-slate-400 text-sm mt-1">Generate and export your financial reports.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleDownload("csv")} variant="ghost" className="px-4 text-xs h-9">Export CSV</Button>
          <Button onClick={() => handleDownload("pdf")} className="px-4 text-xs h-9">Export PDF</Button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 backdrop-blur-sm">
        <select 
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
          value={month} onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({length: 12}).map((_, i) => (
            <option key={i} value={i} className="bg-slate-900">{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select 
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
          value={year} onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y} className="bg-slate-900">{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 bg-white/5 animate-pulse rounded-2xl"></div>
          <div className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Total Income</p>
              <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(reportData.summary.totalIncome)}</h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Total Expense</p>
              <h3 className="text-2xl font-bold text-rose-400">{formatCurrency(reportData.summary.totalExpense)}</h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Net Savings</p>
              <h3 className={`text-2xl font-bold ${reportData.summary.netSavings >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                {formatCurrency(reportData.summary.netSavings)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl h-[350px]">
              <h3 className="text-white font-semibold mb-4">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff10', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl h-[350px]">
              <h3 className="text-white font-semibold mb-4">Daily Spending Trend</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff10', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;
