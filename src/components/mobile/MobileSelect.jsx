import { useState } from "react";
import { X, Check } from "lucide-react";

/**
 * Mobile-friendly bottom sheet select.
 * On mobile (<640px) shows a bottom sheet; on desktop renders as the native shadcn Select.
 */
export default function MobileSelect({ value, onValueChange, options, placeholder = "Select...", label, triggerClassName = "" }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm min-h-[44px] w-full text-left ${triggerClassName}`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label || placeholder}
        </span>
        <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Bottom Sheet Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">{label || placeholder}</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto py-2" style={{ overscrollBehavior: "contain" }}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onValueChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors active:bg-muted ${
                    opt.value === value ? "bg-primary/5 dark:bg-accent/5" : ""
                  }`}
                >
                  <span className={`text-base flex-1 ${opt.value === value ? "font-semibold text-primary dark:text-accent" : "text-foreground"}`}>
                    {opt.label}
                  </span>
                  {opt.value === value && (
                    <Check className="w-5 h-5 text-primary dark:text-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}