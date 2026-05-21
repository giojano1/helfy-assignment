import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({ value, max = 5, readonly = true, onChange }: RatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= value;
        const half = !filled && i + 0.5 <= value;
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(i + 1)}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          >
            <Star
              size={14}
              className={
                filled || half
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-text-muted"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
