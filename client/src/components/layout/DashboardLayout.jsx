import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const navigation = [
  { name: "Dashboard", href: "/dashboard", disabled: false },
  { name: "Transactions", href: "/transactions", disabled: false },
  { name: "Categories", href: "/categories", disabled: false },
  { name: "Budget", href: "/budget", disabled: false },
  { name: "Reports", href: "/reports", disabled: false },
  { name: "AI Insights", href: "/ai", disabled: false },
  { name: "Settings", href: "/settings", disabled: false },
  { name: "Profile", href: "/profile", disabled: false },
];

const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0a0a14] overflow-hidden text-slate-300">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/[0.02] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md shadow-violet-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight text-sm">AI Finance</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return item.disabled ? (
              <div key={item.name} className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-500 cursor-not-allowed opacity-60">
                {item.name} <span className="ml-auto text-[10px] uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">Soon</span>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-violet-500/10 text-violet-400" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Ambient background blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Navbar */}
        <header className="h-16 flex-shrink-0 bg-white/[0.01] backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-white text-sm">AI Finance</span>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Notification Placeholder */}
            <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a14]" />
            </button>
            {/* User */}
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors hidden sm:block">
                {user?.name?.split(" ")[0]} ▾
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
