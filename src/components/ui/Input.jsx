import { cn } from "../../lib/utils";

export function Input({ className, label, error, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-400 ml-1">{label}</label>}
      <div className="relative">
        <input
          className={cn(
            "w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300",
            Icon && "pl-11",
            error && "border-rose-500/50 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400 ml-1">{error}</p>}
    </div>
  );
}
