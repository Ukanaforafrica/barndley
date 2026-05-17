import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export function SearchSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? "" : "text-foreground/40"}>{value || placeholder}</span>
        <ChevronDown className={`size-4 text-foreground/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-[60] left-0 right-0 mt-1.5 rounded-2xl bg-background border border-border shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-2 px-3 h-11 border-b border-border">
            <Search className="size-4 text-foreground/40" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-xs text-foreground/50">No matches</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQ("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary flex items-center justify-between ${
                  opt === "Other" ? "font-semibold text-primary" : ""
                }`}
              >
                <span>{opt}</span>
                {value === opt && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
