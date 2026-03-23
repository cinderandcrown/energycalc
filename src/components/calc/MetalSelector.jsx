import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { METAL_DATABASE, METAL_CATEGORIES, METAL_CATEGORY_ICONS } from "@/lib/metalData";

export default function MetalSelector({ selectedIndex, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = useMemo(() => {
    let metals = METAL_DATABASE.map((m, i) => ({ ...m, idx: i }));
    if (activeCategory !== "All") {
      metals = metals.filter(m => m.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      metals = metals.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.symbol.toLowerCase().includes(q)
      );
    }
    return metals;
  }, [search, activeCategory]);

  const selected = METAL_DATABASE[selectedIndex];

  const categoryCounts = useMemo(() => {
    const counts = { All: METAL_DATABASE.length };
    METAL_DATABASE.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}k`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(3)}`;
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium text-foreground mb-1.5 block">Metal / Material</label>

      <button
        onClick={() => setOpen(!open)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Metal / Material: ${selected?.name || 'Select metal'}`}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-colors text-left focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base">{METAL_CATEGORY_ICONS[selected?.category] || "🔶"}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{selected?.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {selected?.category} · {formatPrice(selected?.defaultPrice)}/{selected?.unit} · {selected?.density} g/cm³
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${METAL_DATABASE.length} metals & materials...`}
                className="w-full pl-8 pr-8 py-2 text-sm bg-muted/50 rounded-lg border-0 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-2 py-1.5 overflow-x-auto scrollbar-hide border-b border-border bg-muted/30">
            {METAL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-xs">{METAL_CATEGORY_ICONS[cat]}</span>
                {cat}
                <span className="text-[9px] opacity-70">({categoryCounts[cat] || 0})</span>
              </button>
            ))}
          </div>

          {/* Metal list */}
          <div className="max-h-64 overflow-y-auto" role="listbox" aria-label="Metals">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No metals found</div>
            ) : (
              filtered.map(metal => (
                <button
                  key={metal.idx}
                  onClick={() => { onChange(metal.idx); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/50 transition-colors ${
                    metal.idx === selectedIndex ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="text-sm">{METAL_CATEGORY_ICONS[metal.category]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${metal.idx === selectedIndex ? "font-bold text-primary dark:text-accent" : "font-medium text-foreground"}`}>
                      {metal.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatPrice(metal.defaultPrice)}/{metal.unit} · {metal.density} g/cm³
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded font-mono">{metal.symbol}</span>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-border px-3 py-1.5 bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center">
              {filtered.length} of {METAL_DATABASE.length} metals · Prices are approximate market rates
            </p>
          </div>
        </div>
      )}
    </div>
  );
}