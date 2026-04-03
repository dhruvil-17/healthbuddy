import React from "react";

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div 
      className={`glass-card rounded-3xl p-6 transition-all duration-500 ${
        hover ? "hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
