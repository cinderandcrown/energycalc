import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { CROP_DATABASE, CROP_CATEGORIES, CATEGORY_ICONS } from "@/lib/cropData";

export default function CropSelector({ selectedIndex, onChange }) {
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
    let crops = CROP_DATABASE.map((c, i) => ({ ...c, idx: i }));
    if (activeCategory !== "All") {
      crops = crops.filter(c => c.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      crops = crops.filter(c =>
        c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }
    return crops;
  }, [search, activeCategory]);

  const selected = CROP_DATABASE[selectedIndex];

  const categoryCounts = useMemo(() => {
    const counts = { All: CROP_DATABASE.length };
    CROP_DATABASE.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium text-foreground mb-1.5 block">Crop Type</label>

      {/* Selected crop pill */}
      <button
        onClick={() => setOpen(!open)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Crop Type: ${selected?.name || 'Select crop'}`}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-colors text-left focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base">{CATEGORY_ICONS[selected?.category] || "🌱"}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{selected?.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {selected?.category} · Avg {selected?.avgYield.toLocaleString()} {selected?.unit} · ${selected?.costPerAcre.toLocaleString()}/ac
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
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
                placeholder={`Search ${CROP_DATABASE.length} crops...`}
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
            {CROP_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-xs">{CATEGORY_ICONS[cat]}</span>
                {cat}
                <span className="text-[9px] opacity-70">({categoryCounts[cat] || 0})</span>
              </button>
            ))}
          </div>

          {/* Crop list */}
          <div className="max-h-64 overflow-y-auto" role="listbox" aria-label="Crops">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No crops found</div>
            ) : (
              filtered.map(crop => (
                <button
                  key={crop.idx}
                  onClick={() => { onChange(crop.idx); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/50 transition-colors ${
                    crop.idx === selectedIndex ? "bg-drill-green/10" : ""
                  }`}
                >
                  <span className="text-sm">{CATEGORY_ICONS[crop.category]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${crop.idx === selectedIndex ? "font-bold text-drill-green" : "font-medium text-foreground"}`}>
                      {crop.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Avg {crop.avgYield.toLocaleString()} {crop.unit} · ${crop.costPerAcre.toLocaleString()}/ac
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded">{crop.category}</span>
                </button>
              ))
            )}
          </div>

          {/* Count */}
          <div className="border-t border-border px-3 py-1.5 bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center">
              {filtered.length} of {CROP_DATABASE.length} crops · Yields are US national averages
            </p>
          </div>
        </div>
      )}
    </div>
  );
}