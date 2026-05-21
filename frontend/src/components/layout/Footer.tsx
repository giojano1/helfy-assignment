import { Link } from "react-router-dom";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-white/10 bg-[#0F0F1A]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold text-brand-primary">ShopForge</span>
          <p className="text-sm text-text-muted leading-relaxed">
            Premium products curated for the modern lifestyle. Quality you can trust.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-text-primary">Shop</p>
          <Link to="/products" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            All Products
          </Link>
          <Link to="/products?categoryId=electronics" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Electronics
          </Link>
          <Link to="/products?categoryId=apparel" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Apparel
          </Link>
          <Link to="/products?categoryId=home" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Home & Living
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-text-primary">Account</p>
          <Link to="/account/profile" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Profile
          </Link>
          <Link to="/account/orders" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Order History
          </Link>
          <Link to="/cart" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Cart
          </Link>
          <Link to="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Sign In
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-text-primary">Newsletter</p>
          <p className="text-sm text-text-muted">Get the latest deals in your inbox.</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button
              onClick={() => setEmail("")}
              className="rounded-lg bg-brand-primary p-2 text-white transition-colors hover:bg-brand-primary/90"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-center text-xs text-text-muted">
          © {new Date().getFullYear()} ShopForge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
