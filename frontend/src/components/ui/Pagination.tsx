import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-text-muted">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-brand-primary text-white"
                  : "text-text-muted hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
