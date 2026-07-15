import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="relative">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-20">404</h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px]">
          <svg className="w-20 h-20 text-rose-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-400 text-center max-w-md mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/dashboard" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/10">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
