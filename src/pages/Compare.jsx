import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { GitCompareArrows, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScenarioSelector from "../components/compare/ScenarioSelector";
import ComparisonTable from "../components/compare/ComparisonTable";
import ComparisonChart from "../components/compare/ComparisonChart";
import AIInsights from "../components/compare/AIInsights";

export default function Compare() {
  const [calculations, setCalculations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Calculation.list("-created_date", 100).then((data) => {
      setCalculations(data.filter((c) => c.results));
      setLoading(false);
    });
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedScenarios = calculations.filter((c) => selectedIds.includes(c.id));
  const canCompare = selectedScenarios.length >= 2;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-primary dark:text-accent" />
            <h1 className="text-xl font-bold text-foreground">Compare Scenarios</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select 2 or more saved calculations to compare side by side
          </p>
        </div>
        <Link to="/scenarios">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </Link>
      </div>

      {calculations.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <GitCompareArrows className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No saved calculations to compare</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Run some calculators and save results first</p>
          <Link to="/calc/net-investment">
            <Button size="sm">Start Calculating</Button>
          </Link>
        </div>
      )}

      {calculations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Selector */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Scenarios
              </p>
              <Badge variant="secondary" className="text-[10px]">
                {selectedIds.length} selected
              </Badge>
            </div>
            <ScenarioSelector
              calculations={calculations}
              selected={selectedIds}
              onToggle={toggleSelection}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-5">
            {!canCompare && (
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
                <Info className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select at least <strong className="text-foreground">2 scenarios</strong> from the left to begin comparing
                </p>
              </div>
            )}

            {canCompare && (
              <>
                <ComparisonTable scenarios={selectedScenarios} />
                <ComparisonChart scenarios={selectedScenarios} />
                <AIInsights scenarios={selectedScenarios} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-muted-foreground max-w-lg mx-auto">
          All comparisons are based on hypothetical, illustrative calculations. They do not constitute investment advice. Consult a licensed professional before making investment decisions.
        </p>
      </div>
    </div>
  );
}