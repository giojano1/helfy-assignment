import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient";
import AuthGuard from "./features/auth/components/AuthGuard";
import GuestGuard from "./features/auth/components/GuestGuard";
import AccountLayout from "./components/layout/AccountLayout";

// ---------------------------------------------------------------------------
// Route-level lazy imports — enables code splitting per page
// ---------------------------------------------------------------------------
const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// ---------------------------------------------------------------------------
// Animated routes wrapper — reads location for AnimatePresence key
// ---------------------------------------------------------------------------
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Guest-only routes (redirect authenticated users away) */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes (redirect unauthenticated users to /login) */}
        <Route element={<AuthGuard />}>
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Account section — nested layout */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="/account/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Root application component
// ---------------------------------------------------------------------------

/**
 * App — root component.
 * Provides React Query, React Router, and toast notifications.
 * All routes are declared here with lazy loading and AnimatePresence transitions.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
            </div>
          }
        >
          <AnimatedRoutes />
        </Suspense>

        {/* Toast notifications — top-right, dark theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#EAEAEA",
              border: "1px solid rgba(108, 99, 255, 0.3)",
            },
            success: {
              iconTheme: {
                primary: "#6C63FF",
                secondary: "#EAEAEA",
              },
            },
            error: {
              iconTheme: {
                primary: "#E94560",
                secondary: "#EAEAEA",
              },
            },
          }}
        />
      </BrowserRouter>

      {/* React Query devtools — only in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
