import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../features/cart/store/cartStore";
import { useLogout } from "../../features/auth/hooks/useLogout";

export default function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F0F1A]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-brand-primary">
          ShopForge
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/products" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openDrawer}
            className="relative rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                <User size={18} />
                <span className="hidden md:inline">
                  {user?.firstName ?? "Account"}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-white/10 bg-[#0F0F1A] py-1 shadow-xl">
                    <Link
                      to="/account/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-white/10 hover:text-text-primary transition-colors"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-white/10 hover:text-text-primary transition-colors"
                    >
                      <Package size={15} /> Orders
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-brand-accent hover:bg-white/10 transition-colors"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            >
              Sign in
            </button>
          )}

          <button
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-text-muted hover:text-text-primary"
          >
            Shop
          </Link>
        </div>
      )}
    </header>
  );
}
