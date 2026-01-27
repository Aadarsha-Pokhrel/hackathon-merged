import { cn } from "../../lib/utils";

export function Button({ 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading, 
  children, 
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 border-0",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10 p-2 flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">
          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
}
