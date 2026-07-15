import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../store/slices/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading || !data.summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary, categoryBreakdown, monthlyTrend, recentTransactions } = data;

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="space-y-6 pb-12 relative max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here is your financial overview for this month.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full transition-transform group-hover:scale-150" />
          <p className="text-sm font-medium text-slate-400 mb-1">Total Income</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(data.summary.totalIncome)}</h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Transactions</p>
              <p className="text-sm font-medium text-emerald-400">{recentTransactions.length > 0 ? recentTransactions.length + '+' : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full transition-transform group-hover:scale-150" />
          <p className="text-sm font-medium text-slate-400 mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(data.summary.totalExpense)}</h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Largest Expense</p>
              <p className="text-sm font-medium text-rose-400">{formatCurrency(data.summary.largestExpense || 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full transition-transform group-hover:scale-150" />
          <p className="text-sm font-medium text-slate-400 mb-1">Total Balance</p>
          <h3 className={`text-3xl font-bold tracking-tight ${data.summary.totalSavings >= 0 ? "text-white" : "text-rose-400"}`}>
            {formatCurrency(data.summary.totalSavings)}
          </h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Current Savings Rate</p>
              <p className="text-sm font-medium text-violet-400">
                {data.summary.totalIncome > 0 
                  ? ((data.summary.totalSavings / data.summary.totalIncome) * 100).toFixed(1) + "%" 
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full transition-transform group-hover:scale-150" />
          <p className="text-sm font-medium text-slate-400 mb-1">Remaining Budget</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(data.summary.remainingBudget || 0)}</h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Highest Spending Category</p>
              <p className="text-sm font-medium text-blue-400">{categoryBreakdown[0]?.name || "None"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col">
            <h3 className="text-white font-semibold mb-6">Monthly Income vs Expense</h3>
            {monthlyTrend.length > 0 ? (
              <div className="w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip 
                      cursor={{fill: '#ffffff05'}}
                      contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full min-h-[250px] flex items-center justify-center text-slate-500 text-sm">No trend data available</div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col">
            <h3 className="text-white font-semibold mb-6">Monthly Spending Trend</h3>
            {monthlyTrend.length > 0 ? (
              <div className="w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="expense" name="Spending" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full min-h-[250px] flex items-center justify-center text-slate-500 text-sm">No trend data available</div>
            )}
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col">
          <h3 className="text-white font-semibold mb-2">Expense Breakdown</h3>
          {categoryBreakdown.length > 0 ? (
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">No expenses this month</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget Status */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
          <h3 className="text-white font-semibold mb-6">Budget Status</h3>
          {summary.monthlyBudget > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Spent</span>
                <span className="text-white font-medium">{((summary.totalExpense / summary.monthlyBudget) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${summary.totalExpense > summary.monthlyBudget ? 'bg-rose-500' : 'bg-violet-500'}`}
                  style={{ width: `${Math.min((summary.totalExpense / summary.monthlyBudget) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                {summary.totalExpense > summary.monthlyBudget 
                  ? <span className="text-rose-400">You have exceeded your monthly budget</span>
                  : `You can still spend ${formatCurrency(summary.remainingBudget)} this month`
                }
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm mb-4">You haven't set a monthly budget yet.</p>
              <a href="/budget" className="text-violet-400 hover:text-violet-300 text-sm font-medium">Set Budget &rarr;</a>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold">Recent Transactions</h3>
            <a href="/transactions" className="text-violet-400 hover:text-violet-300 text-sm font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            {recentTransactions.length > 0 ? (
              <table className="w-full text-left">
                <tbody>
                  {recentTransactions.map(t => (
                    <tr key={t._id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {t.type === 'income' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{t.title}</p>
                            <p className="text-xs text-slate-500">{t.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400 whitespace-nowrap">
                        {formatDate(t.transactionDate)}
                      </td>
                      <td className={`py-3 pl-4 text-right text-sm font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">No transactions yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
