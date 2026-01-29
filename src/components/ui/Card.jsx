import { cn } from "../../lib/utils";

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-slate-800 rounded-2xl p-6 w-full min-h-[60px] text-white", // ensure min height & text visible
        hoverEffect &&
          "hover:bg-slate-700 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
