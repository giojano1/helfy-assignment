/**
 * NotFoundPage — 404 catch-all route.
 * Full animated implementation in Phase 4.
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold text-brand-primary">404</h1>
      <p className="text-xl text-text-muted">Page not found</p>
      <a
        href="/"
        className="text-brand-primary underline hover:text-brand-accent"
      >
        Go Home
      </a>
    </div>
  );
}
