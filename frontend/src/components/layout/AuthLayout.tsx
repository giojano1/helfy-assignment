import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-gradient p-12 lg:flex">
        <Link to="/" className="text-2xl font-bold text-white">
          ShopForge
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Shop the future,<br />delivered today.
          </h1>
          <p className="mt-4 text-white/80">
            Thousands of premium products. Fast shipping. Unbeatable prices.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} ShopForge</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#0F0F1A] px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
