import React from "react";

/**
 * Animated spinner.
 *
 * Props:
 *   size — "sm" | "md" (default) | "lg"
 */
const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

const Loader = ({ size = "md" }) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-white/20 border-t-white animate-spin ${sizes[size]}`}
    />
  );
};

export default Loader;
