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
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import CheckoutLayout from "./components/layout/CheckoutLayout";
import { useInitAuth } from "./features/auth/hooks/useInitAuth";
import { Spinner } from "./components/ui/Spinner";

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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<AuthGuard />}>
          <Route element={<CheckoutLayout />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="/account/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppInner() {
  useInitAuth();
  return (
    <>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <AnimatedRoutes />
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A2E",
            color: "#EAEAEA",
            border: "1px solid rgba(108, 99, 255, 0.3)",
          },
          success: {
            iconTheme: { primary: "#6C63FF", secondary: "#EAEAEA" },
          },
          error: {
            iconTheme: { primary: "#E94560", secondary: "#EAEAEA" },
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
