import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Droplets, Flame, TrendingUp, Star, Trash2, FolderPlus, GitCompareArrows, Zap, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/mobile/PageHeader";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import DealAnalysis from "../components/scenarios/DealAnalysis";

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
};

const typeColors = {
  net_investment: "bg-petroleum/10 text-petroleum dark:bg-primary/20 dark:text-primary",
  barrels_to_cash: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  natgas_to_cash: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  rate_of_return: "bg-drill-green/10 text-drill-green",
};

const getHeroValue = (calc) => {
  if (!calc.results) return null;
  const r = calc.results;
  if (calc.calc_type === "net_investment") return { label: "Net Investment", value: r.netInvestment };
  if (calc.calc_type === "barrels_to_cash") return { label: "Net Monthly", value: r.netMonthly };
  if (calc.calc_type === "natgas_to_cash") return { label: "Net Monthly", value: r.netMonthly };
  if (calc.calc_type === "rate_of_return") return { label: "Simple ROI", value: r.simpleROI, suffix: "%" };
  return null;
};

export default function Scenarios() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    const data = await base44.entities.Calculation.list("-created_date", 50);
    setCalculations(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleFavMutation = useMutation({
    mutationFn: ({ id, isFav }) => base44.entities.Calculation.update(id, { is_favorite: !isFav }),
    onMutate: ({ id, isFav }) => {
      setCalculations(prev => prev.map(c => c.id === id ? { ...c, is_favorite: !isFav } : c));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Calculation.delete(id),
    onMutate: (id) => {
      setCalculations(prev => prev.filter(c => c.id !== id));
      toast({ title: "Deleted", description: "Calculation removed." });
    },
  });

  const toggleFavorite = (calc) => toggleFavMutation.mutate({ id: calc.id, isFav: calc.is_favorite });
  const deleteCalc = (id) => deleteMutation.mutate(id);

  const favorites = calculations.filter((c) => c.is_favorite);
  const others = calculations.filter((c) => !c.is_favorite);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={loadData}>
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Scenarios"
          subtitle={`${calculations.length} saved calculation${calculations.length !== 1 ? "s" : ""}`}
          icon={FolderOpen}
        />
        <div className="flex items-center gap-2">
          {calculations.length >= 2 && (
            <Link to="/compare">
              <Button size="sm" variant="outline" className="gap-1.5">
                <GitCompareArrows className="w-4 h-4" />
                Compare
              </Button>
            </Link>
          )}
          <Link to="/calc/net-investment">
            <Button size="sm" className="gap-1.5">
              <FolderPlus className="w-4 h-4" />
              New Calc
            </Button>
          </Link>
        </div>
      </div>

      {calculations.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <Calculator className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No saved calculations</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Run a calculator and click "Save & Name" to store results here</p>
          <Link to="/calc/net-investment">
            <Button size="sm">Start Calculating</Button>
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-crude-gold fill-crude-gold" /> Favorites
          </h2>
          <CalcList items={favorites} onToggleFav={toggleFavorite} onDelete={deleteCalc} analyzingId={analyzingId} onAnalyze={setAnalyzingId} />
        </section>
      )}

      {others.length > 0 && (
        <section>
          {favorites.length > 0 && (
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">All Calculations</h2>
          )}
          <CalcList items={others} onToggleFav={toggleFavorite} onDelete={deleteCalc} analyzingId={analyzingId} onAnalyze={setAnalyzingId} />
        </section>
      )}
    </div>
    </PullToRefresh>
  );
}

function CalcList({ items, onToggleFav, onDelete, analyzingId, onAnalyze }) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {items.map((calc) => {
          const Icon = typeIcons[calc.calc_type] || Calculator;
          const hero = getHeroValue(calc);
          return (
            <div key={calc.id}>
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeColors[calc.calc_type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{calc.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5">{typeLabels[calc.calc_type]}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(calc.created_date).toLocaleDateString()}</span>
                </div>
                {calc.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{calc.notes}</p>}
              </div>
              {hero && (
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{hero.label}</p>
                  <p className="font-mono font-bold text-sm text-foreground">
                    {hero.suffix ? `${(hero.value || 0).toFixed(1)}${hero.suffix}` : `$${(hero.value || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-7 sm:h-7" onClick={() => onToggleFav(calc)} aria-label={calc.is_favorite ? "Remove from favorites" : "Add to favorites"}>
                  <Star className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${calc.is_favorite ? "text-crude-gold fill-crude-gold" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-7 sm:h-7 text-crude-gold" onClick={() => onAnalyze(analyzingId === calc.id ? null : calc.id)} aria-label="AI Deal Analysis">
                  <Zap className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-7 sm:h-7 text-muted-foreground hover:text-destructive" aria-label="Delete calculation">
                      <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{calc.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(calc.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
            {analyzingId === calc.id && (
              <DealAnalysis calc={calc} onClose={() => onAnalyze(null)} />
            )}
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}