import { useState, useRef, useEffect, useCallback } from "react";
import { X, Check } from "lucide-react";

/**
 * ADA-compliant mobile-friendly bottom sheet select.
 * Implements WAI-ARIA listbox pattern with keyboard navigation and focus trapping.
 */
export default function MobileSelect({ value, onValueChange, options, placeholder = "Select...", label, triggerClassName = "", id }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = options.find(o => o.value === value);
  const listboxId = id ? `${id}-listbox` : `ms-listbox-${Math.random().toString(36).slice(2, 8)}`;

  // Focus first selected option when sheet opens
  useEffect(() => {
    if (open) {
      const idx = options.findIndex(o => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
      // Trap focus inside sheet
      const handleTab = (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
        }
      };
      document.addEventListener("keydown", handleTab);
      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [open, value, options]);

  // Scroll active option into view
  useEffect(() => {
    if (open && listRef.current && activeIndex >= 0) {
      const active = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      active?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const selectOption = useCallback((opt) => {
    onValueChange(opt.value);
    setOpen(false);
    // Return focus to trigger
    setTimeout(() => triggerRef.current?.focus(), 50);
  }, [onValueChange]);

  const handleKeyDown = useCallback((e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          selectOption(options[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setTimeout(() => triggerRef.current?.focus(), 50);
        break;
    }
  }, [open, activeIndex, options, selectOption]);

  return (
    <>
      {/* Trigger button — combobox pattern */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-label={label || placeholder}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm min-h-[44px] w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${triggerClassName}`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label || placeholder}
        </span>
        <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Bottom Sheet Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="presentation"
          onClick={() => { setOpen(false); setTimeout(() => triggerRef.current?.focus(), 50); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[20px] border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] flex flex-col"
            style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={label || placeholder}
            onKeyDown={handleKeyDown}
          >
            {/* Handle — iOS-style */}
            <div className="flex justify-center pt-2 pb-1" aria-hidden="true">
              <div className="w-9 h-[5px] rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-[17px] font-semibold text-foreground tracking-tight" id={`${listboxId}-label`}>
                {label || placeholder}
              </h3>
              <button
                onClick={() => { setOpen(false); setTimeout(() => triggerRef.current?.focus(), 50); }}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Options — listbox */}
            <div
              ref={listRef}
              role="listbox"
              id={listboxId}
              aria-labelledby={`${listboxId}-label`}
              className="flex-1 overflow-y-auto py-2"
              style={{ overscrollBehavior: "contain" }}
              tabIndex={-1}
            >
              {options.map((opt, idx) => (
                <button
                  key={opt.value}
                  id={`${listboxId}-opt-${idx}`}
                  role="option"
                  aria-selected={opt.value === value}
                  data-index={idx}
                  onClick={() => selectOption(opt)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors active:bg-muted/60 ${
                    opt.value === value ? 'bg-primary/5 dark:bg-accent/5' : ''
                  } ${idx === activeIndex ? 'bg-muted/40' : ''}`}
                >
                  <span className={`text-[15px] flex-1 ${opt.value === value ? 'font-semibold text-primary dark:text-accent' : 'text-foreground'}`}>
                    {opt.label}
                  </span>
                  {opt.value === value && (
                    <Check className="w-5 h-5 text-primary dark:text-accent shrink-0" aria-hidden="true" />
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