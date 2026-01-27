import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Menu, X, LogOut, LayoutDashboard, Bell, Wallet, Users, CreditCard, User, ChevronDown } from "lucide-react";
import { Button } from "./Button";

export function Layout({ children, role = "member", onLogout, menuItems = [] }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-xl">{role === 'admin' ? 'A' : 'M'}</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none tracking-tight">FinCorp</h1>
              <p className="text-xs text-slate-400 mt-1 capitalize">{role} Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== role && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-white bg-indigo-600 shadow-lg shadow-indigo-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <Button variant="ghost" className="w-full justify-start text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" onClick={onLogout}>
            <LogOut size={18} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 glass-panel sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>

          <div className="md:hidden font-semibold text-white">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </div>

          <div className="flex items-center gap-4 ml-auto">
             <button className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5 transition-all">
                <Bell size={18} />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-white">Guest User</div>
                  <div className="text-xs text-slate-500">View Profile</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border-2 border-slate-800 shadow-md"></div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
