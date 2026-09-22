"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Types — swap inventory source later (RTK Query) without changing consumers
// ---------------------------------------------------------------------------

export type SelectedItem = {
  id: string;
  name: string;
  description?: string | null;
  rate: number;
  unit: string;
  taxRate: number;
  hsnSac?: string | null;
  stock?: number | null;
};

export type ItemSearchSelectProps = {
  /** Called when user picks an item or clears selection */
  onSelect: (item: SelectedItem | null) => void;
  /** Free-text while typing (manual item name) */
  onQueryChange?: (query: string) => void;
  /** Optional controlled display name (e.g. form field value) */
  value?: string;
  /** Label above the control — pass empty string to hide */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

// ---------------------------------------------------------------------------
// Temporary static source — replace with useInventoryItems() / RTK Query
// ---------------------------------------------------------------------------

const STATIC_INVENTORY: SelectedItem[] = [
  {
    id: "item-1",
    name: "Daikin 1.5 Ton Inverter Split Air Conditioner",
    description:
      "Energy-efficient 5-star inverter split AC with copper condenser.",
    rate: 42500,
    unit: "PCS",
    taxRate: 18,
    hsnSac: "8415",
    stock: 12,
  },
  {
    id: "item-2",
    name: "AC Installation Service",
    description: "Installation of indoor and outdoor units, testing.",
    rate: 2500,
    unit: "JOB",
    taxRate: 18,
    stock: null,
  },
  {
    id: "item-3",
    name: "Website Development",
    description: "Custom responsive website",
    rate: 45000,
    unit: "NOS",
    taxRate: 18,
    stock: null,
  },
  {
    id: "item-4",
    name: "UI/UX Design",
    description: "Figma design system + screens",
    rate: 28000,
    unit: "NOS",
    taxRate: 18,
    stock: null,
  },
];

/**
 * Hook seam for future dynamic inventory.
 * Today: filters STATIC_INVENTORY.
 * Later: call RTK Query with `debounced` and return { data, isLoading }.
 */
function useItemSearch(debounced: string) {
  // const { data, isFetching } = useGetInventoryItemsQuery({ search: debounced, limit: 20 });
  const isLoading = false;

  const items = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return STATIC_INVENTORY;
    return STATIC_INVENTORY.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.description || "").toLowerCase().includes(q) ||
        (i.hsnSac || "").toLowerCase().includes(q),
    );
  }, [debounced]);

  return { items, isLoading };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ItemSearchSelect({
  onSelect,
  onQueryChange,
  value,
  label = "Item",
  placeholder = "Search inventory item",
  disabled = false,
  className = "",
}: ItemSearchSelectProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);

  const { items, isLoading } = useItemSearch(debounced);

  // Sync external value (form) → input
  useEffect(() => {
    if (value !== undefined && value !== query && !open) {
      setQuery(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = inputWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = Math.min(Math.max(r.width, 320), Math.max(280, window.innerWidth - r.left - 12));
      let left = r.left;
      if (left + width > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - width - 8);
      }
      setDropdownPos({
        top: r.bottom + 6,
        left,
        width,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const openDropdown = () => {
    if (disabled) return;
    setOpen(true);
    const el = inputWrapRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const width = Math.min(Math.max(r.width, 320), Math.max(280, window.innerWidth - r.left - 12));
      let left = r.left;
      if (left + width > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - width - 8);
      }
      setDropdownPos({
        top: r.bottom + 6,
        left,
        width,
      });
    }
  };

  const selectItem = (item: SelectedItem) => {
    setSelectedId(item.id);
    setQuery(item.name);
    setOpen(false);
    onSelect(item);
  };

  const clear = () => {
    setSelectedId(null);
    setQuery("");
    setOpen(false);
    onSelect(null);
  };

  return (
    <div className={`relative z-20 space-y-1 ${className}`} ref={containerRef}>
      {label ? (
        <Label className="text-[11px] font-medium text-slate-500">{label}</Label>
      ) : null}

      <div className="relative" ref={inputWrapRef}>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          disabled={disabled}
          onFocus={openDropdown}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setSelectedId(null);
            onSelect(null);
            onQueryChange?.(v);
            openDropdown();
          }}
          placeholder={placeholder}
          className="h-9 bg-white pl-8 pr-14 text-sm"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {isLoading && (
            <Loader2 className="size-3.5 animate-spin text-slate-400" />
          )}
          {query && !disabled && (
            <button
              type="button"
              onClick={clear}
              className="grid size-6 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear item"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown className="size-3.5 text-slate-400" />
        </div>
      </div>

      {open && dropdownPos && (
        <div
          className="fixed z-[9999] max-h-[min(280px,45vh)] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Searching…
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">
              No item found. Keep typing to use as custom name.
            </div>
          ) : (
            items.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectItem(item)}
                  className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-100 px-3 py-2.5 text-left last:border-b-0 ${
                    isSelected ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <ItemDetails item={item} />
                  {isSelected && (
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function ItemDetails({ item }: { item: SelectedItem }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
      {item.description ? (
        <p className="line-clamp-1 text-xs text-slate-500">{item.description}</p>
      ) : null}
      <p className="mt-0.5 text-xs text-slate-600">
        ₹{item.rate.toLocaleString("en-IN")} · {item.unit}
        {item.hsnSac ? ` · HSN ${item.hsnSac}` : ""}
        {item.stock != null ? ` · Stock ${item.stock}` : ""}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------
// import ItemSearchSelect, { type SelectedItem } from
//   "@/modules/sales/shared/components/item-search-select";
//
// <ItemSearchSelect
//   label="" // hide label inside table row
//   onSelect={(item) => { ... fill form fields }}
// />