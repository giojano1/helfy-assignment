import { Outlet } from "react-router-dom";

/**
 * AccountLayout — sidebar nav + main content area.
 * Used by all /account/* pages.
 * Full implementation in Phase 4 (account feature).
 */
export default function AccountLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — full implementation in Phase 4 */}
      <aside className="w-64 bg-brand-surface border-r border-white/10 p-6">
        <nav className="flex flex-col gap-2">
          <a
            href="/account/profile"
            className="text-text-muted hover:text-text-primary"
          >
            Profile
          </a>
          <a
            href="/account/orders"
            className="text-text-muted hover:text-text-primary"
          >
            Orders
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
