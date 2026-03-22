import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function InputWithSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  tooltip = "",
  format = (v) => v,
}) {
  const handleSliderChange = ([val]) => onChange(val);
  const handleInputChange = (e) => {
    const raw = parseFloat(e.target.value.replace(/[^0-9.-]/g, ""));
    if (!isNaN(raw)) {
      const clamped = Math.min(max, Math.max(min, raw));
      onChange(clamped);
    }
  };

  const displayValue = format ? format(value) : value;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs" side="top">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <div className="relative shrink-0 w-28">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {prefix}
            </span>
          )}
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            className={`h-8 text-sm font-mono text-right ${prefix ? "pl-5" : ""} ${suffix ? "pr-6" : ""}`}
            min={min}
            max={max}
            step={step}
          />
          {suffix && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}