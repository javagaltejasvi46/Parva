import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Ticket, Users, Wallet, ArrowRightLeft, LogOut } from "lucide-react";
import React from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const { logout } = React.useContext(AuthContext);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Events", path: "/events", icon: Ticket },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Cashout", path: "/cashout", icon: ArrowRightLeft },
    { name: "Admin", path: "/admin", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col relative">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-900/60 border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6 md:px-12">
          <Link to="/" className="text-2xl font-bold tracking-tight text-gradient">
            Parva
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? "bg-white/10 text-neon-cyan shadow-[0_0_15px_rgba(0,255,204,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 md:p-8 relative z-0">
        <Outlet />
      </main>
    </div>
  );
}
