interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export function Skeleton({ width, height, rounded = false, className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      style={{ width, height }}
    />
  );
}
