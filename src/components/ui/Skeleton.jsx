import React from "react";

const Skeleton = ({ className = "", variant = "rect", ...props }) => {
  const variants = {
    rect: "rounded-lg",
    circle: "rounded-full",
    pill: "rounded-full h-4",
    text: "rounded h-4 w-3/4"
  };

  return (
    <div 
      className={`
        bg-gray-200/50 animate-pulse-slow 
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  );
};

export default Skeleton;
