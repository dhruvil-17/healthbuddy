import React from "react";

const Badge = ({ children, variant = "neutral", className = "", ...props }) => {
  const variants = {
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
    primary: "bg-primary-50 text-primary-700 border-primary-200 shadow-sm shadow-primary-500/5",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    glass: "glass-card px-3 py-1 text-primary-700 bg-white/40"
  };

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 
        rounded-full text-xs font-bold border
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
