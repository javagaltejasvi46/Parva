import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="text-lg font-semibold">
            Student Token Launchpad
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Events</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
