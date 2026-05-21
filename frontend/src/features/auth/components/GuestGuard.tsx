import { Navigate, Outlet } from "react-router-dom";

/**
 * GuestGuard — redirects authenticated users away from guest-only routes
 * such as /login and /register.
 * Full implementation in Phase 4 (reads from Zustand auth store).
 *
 * @returns The guest route outlet or a redirect to / for authenticated users
 */
export default function GuestGuard() {
  // TODO Phase 4: replace with real auth check from Zustand store
  // const { isAuthenticated, isLoading } = useAuth();
  // if (isLoading) return <Spinner />;
  // if (isAuthenticated) return <Navigate to="/" replace />;
  const isAuthenticated = false; // stub — always allow in Phase 1

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
