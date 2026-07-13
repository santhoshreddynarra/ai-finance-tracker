import React from "react";
import Loader from "./Loader";

/**
 * Primary button with loading state.
 *
 * Props:
 *   children  — button label
 *   loading   — shows spinner and disables button when true
 *   variant   — "primary" (default) | "ghost"
 *   ...rest   — forwarded to <button>
 */
const Button = ({ children, loading = false, variant = "primary", className = "", ...rest }) => {
  const base =
    "inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98]",
    ghost:
      "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white active:scale-[0.98]",
  };

  return (
    <button
      disabled={loading || rest.disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader size="sm" /> : children}
    </button>
  );
};

export default Button;
