import React from "react";
import { useSelector } from "react-redux";

/**
 * Temporary dashboard placeholder — replaced in a future phase
 * with charts, transactions, budgets, and AI insights.
 */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative">
      {/* Fixed ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-indigo-700/10 rounded-full blur-3xl" />
      </div>



      <main className="relative pt-8 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {user?.name ?? "there"}
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Your AI-powered finance dashboard is on its way.
          </p>
        </div>

        {/* Coming soon card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center shadow-xl min-h-[280px]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Dashboard Coming Soon</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              Charts, transactions, budgets, and AI-powered insights will appear here in the next phase.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Authentication complete — next phase incoming
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
