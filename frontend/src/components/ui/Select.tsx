import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select…",
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`flex flex-col gap-1 ${className}`} ref={ref}>
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between rounded-lg border bg-white/5 px-4 py-2.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            error ? "border-brand-accent" : "border-white/10"
          } ${selected ? "text-text-primary" : "text-text-muted"}`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0F0F1A] py-1 shadow-xl">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                  opt.value === value ? "text-brand-primary" : "text-text-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-brand-accent">{error}</p>}
    </div>
  );
}
