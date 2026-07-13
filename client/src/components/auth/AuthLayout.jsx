import React from "react";

/**
 * Centered card layout for auth pages (Login / Register).
 * Renders a dark-themed split: left branding panel + right form card.
 */
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AI Finance Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>

        {/* Form card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
