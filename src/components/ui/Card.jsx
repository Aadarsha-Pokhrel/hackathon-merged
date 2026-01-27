import { cn } from "../../lib/utils";

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6",
        hoverEffect && "hover:bg-slate-800/50 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
