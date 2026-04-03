import React from "react";

const Input = React.forwardRef(({ 
  className = "", 
  label, 
  error, 
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative group perspective-1000">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/70 backdrop-blur-sm
            border border-gray-200 group-hover:border-primary-300 focus:border-primary-500
            rounded-xl py-3 ${Icon ? "pl-11" : "px-4"} pr-4
            text-gray-900 placeholder:text-gray-400
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:shadow-xl
            ${error ? "border-red-500 focus:ring-red-500/10" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;