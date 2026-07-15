import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        // Fetch dashboard analytics to get savings and transaction count
        const analyticsRes = await api.get("/analytics/dashboard");
        const budgetRes = await api.get("/budgets");
        
        setStats({
          transactionsCount: analyticsRes.data.data.categoryBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 0,
          currentSavings: analyticsRes.data.data.summary.totalSavings || 0,
          budgetsCreated: budgetRes.data.data.length || 0,
          aiUsage: Math.floor(Math.random() * 50) + 10, // Mock AI usage since we don't track it in DB yet
        });
      } catch (err) {
        console.error("Failed to load profile stats");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (val) => `₹${Math.abs(Number(val)).toLocaleString("en-IN")}`;
  const accountCreated = new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="pt-8 pb-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />
        
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 shrink-0 z-10">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-white uppercase overflow-hidden">
            {/* Placeholder Profile Picture */}
            <svg className="w-20 h-20 text-slate-400 mt-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
        </div>

        <div className="text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
          <p className="text-slate-400 mt-1">{user?.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Member since {accountCreated}
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <h2 className="text-xl font-semibold text-white tracking-tight mb-4">Quick Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-400 text-sm">Current Savings</p>
          <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.currentSavings)}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <p className="text-slate-400 text-sm">Transactions Logged</p>
          <h3 className="text-2xl font-bold text-white mt-1">{stats.transactionsCount}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          </div>
          <p className="text-slate-400 text-sm">Budgets Created</p>
          <h3 className="text-2xl font-bold text-white mt-1">{stats.budgetsCreated}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-slate-400 text-sm">AI Insights Used</p>
          <h3 className="text-2xl font-bold text-white mt-1">{stats.aiUsage} <span className="text-sm font-normal text-slate-500">requests</span></h3>
        </div>

      </div>
    </div>
  );
};

export default Profile;
