import React from "react";

/**
 * Reusable labeled text/password input.
 *
 * Props:
 *   id        — unique HTML id (also used as name)
 *   label     — visible label text
 *   type      — input type (default "text")
 *   value     — controlled value
 *   onChange  — change handler
 *   error     — optional inline error string
 *   ...rest   — forwarded to <input>
 */
const InputField = ({ id, label, type = "text", value, onChange, error, ...rest }) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500
          text-sm outline-none transition-all duration-200
          focus:ring-2 focus:ring-violet-500 focus:border-transparent
          ${error ? "border-red-500" : "border-white/10 hover:border-white/20"}`}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default InputField;
