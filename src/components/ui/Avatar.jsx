import React from "react";

const Avatar = ({ src, name, size = "md", className = "", ...props }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-xl",
    xl: "h-32 w-32 text-2xl"
  };

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center shrink-0 
        rounded-2xl glass-card overflow-hidden transition-all duration-300
        hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="h-full w-full object-cover" 
        />
      ) : (
        <span className="font-bold text-primary-600 bg-primary-100/50 w-full h-full flex items-center justify-center">
          {initials || "?"}
        </span>
      )}
      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default Avatar;
