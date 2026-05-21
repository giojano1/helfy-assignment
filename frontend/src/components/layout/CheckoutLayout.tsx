import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CheckoutLayout() {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <header className="border-b border-white/10 px-4 py-5">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-xl font-bold text-brand-primary">
            ShopForge
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
