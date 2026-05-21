import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({ message = "Something went wrong.", onRetry }: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-brand-accent/30 bg-brand-accent/5 py-16 text-center">
      <AlertCircle size={48} className="text-brand-accent opacity-80" />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-text-primary">Error</p>
        <p className="text-sm text-text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
