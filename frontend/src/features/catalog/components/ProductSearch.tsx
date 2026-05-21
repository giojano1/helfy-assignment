import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 300);
    return () => clearTimeout(t);
  }, [local, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    </div>
  );
}
