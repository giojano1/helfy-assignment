import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen flex-col items-center justify-center gap-4"
    >
      <h1 className="text-8xl font-bold text-brand-primary">404</h1>
      <p className="text-xl text-text-muted">Page not found</p>
      <Link to="/" className="text-brand-primary hover:underline">
        Go Home
      </Link>
    </motion.div>
  );
}
