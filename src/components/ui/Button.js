import React from "react";

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none btn-premium";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-primary-500/25",
    secondary: "bg-white text-primary-700 border border-primary-100 hover:bg-primary-50 hover:border-primary-200 shadow-sm",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
    ghost: "bg-transparent text-primary-600 hover:bg-primary-50",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-red-500/25",
    glass: "glass-card text-primary-700 hover:bg-white/90"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button 
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : LeftIcon ? (
        <LeftIcon className="mr-2 h-5 w-5" />
      ) : null}
      {children}
      {!isLoading && RightIcon && (
        <RightIcon className="ml-2 h-5 w-5" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;