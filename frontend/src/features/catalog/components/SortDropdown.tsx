import { Select } from "../../../components/ui/Select";
import type { ProductFilters } from "../types";

interface SortDropdownProps {
  sort?: ProductFilters["sort"];
  order?: ProductFilters["order"];
  onChange: (sort: ProductFilters["sort"], order: ProductFilters["order"]) => void;
}

const OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "createdAt:asc", label: "Oldest" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "rating:desc", label: "Top Rated" },
];

export function SortDropdown({ sort, order, onChange }: SortDropdownProps) {
  const current = sort && order ? `${sort}:${order}` : "createdAt:desc";

  return (
    <Select
      options={OPTIONS}
      value={current}
      onChange={(val) => {
        const [s, o] = val.split(":") as [ProductFilters["sort"], ProductFilters["order"]];
        onChange(s, o);
      }}
      className="w-48"
    />
  );
}
