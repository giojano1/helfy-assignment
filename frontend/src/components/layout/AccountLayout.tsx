import { NavLink, Outlet } from "react-router-dom";
import { User, Package } from "lucide-react";
import Header from "./Header";

export default function AccountLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? "bg-brand-primary/20 text-brand-primary font-medium"
        : "text-text-muted hover:bg-white/10 hover:text-text-primary"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8">
        <aside className="w-56 shrink-0">
          <nav className="flex flex-col gap-1">
            <NavLink to="/account/profile" className={linkClass}>
              <User size={16} /> Profile
            </NavLink>
            <NavLink to="/account/orders" className={linkClass}>
              <Package size={16} /> Orders
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
