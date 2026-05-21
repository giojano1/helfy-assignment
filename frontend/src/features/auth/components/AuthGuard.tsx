import { Navigate, Outlet } from "react-router-dom";

/**
 * AuthGuard — protects routes that require authentication.
 * Redirects unauthenticated users to /login.
 * Full implementation in Phase 4 (reads from Zustand auth store).
 *
 * @returns The protected route outlet or a redirect to /login
 */
export default function AuthGuard() {
  // TODO Phase 4: replace with real auth check from Zustand store
  // const { isAuthenticated, isLoading } = useAuth();
  // if (isLoading) return <Spinner />;
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAuthenticated = true; // stub — always allow in Phase 1

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
