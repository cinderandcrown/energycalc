import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BarChart3, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/mobile/PageHeader";
import PullToRefresh from "@/components/mobile/PullToRefresh";

import PortfolioSummaryCards from "../components/portfolio/PortfolioSummaryCards";
import TaxSavingsBreakdown from "../components/portfolio/TaxSavingsBreakdown";
import CashFlowChart from "../components/portfolio/CashFlowChart";
import PayoutTracker from "../components/portfolio/PayoutTracker";
import ProjectBreakdownTable from "../components/portfolio/ProjectBreakdownTable";

export default function Portfolio() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const data = await base44.entities.Calculation.list("-created_date", 100);
    setCalculations(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    let totalInvested = 0;
    let totalTaxSavings = 0;
    let totalAnnualCashFlow = 0;

    calculations.forEach((c) => {
      if (!c.results) return;

      if (c.calc_type === "net_investment") {
        totalInvested += c.inputs?.totalInvestment || 0;
        totalTaxSavings += c.results?.totalYear1TaxSavings || 0;
      }

      if (c.calc_type === "barrels_to_cash" || c.calc_type === "natgas_to_cash") {
        totalAnnualCashFlow += c.results?.netAnnual || 0;
      }
    });

    return {
      totalInvested,
      totalTaxSavings,
      totalAnnualCashFlow,
      projectCount: calculations.length,
    };
  }, [calculations]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-1">No Saved Projects Yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Run a calculator and save your results to see portfolio-wide analytics, tax savings summaries, and cash flow projections here.
          </p>
          <Link to="/calc/net-investment">
            <Button className="gap-2">
              <Calculator className="w-4 h-4" />
              Start Your First Calculation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={loadData}>
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PageHeader
            title="Portfolio Analytics"
            subtitle="Aggregated view of all your saved calculations and projections"
            icon={BarChart3}
          />
          <Link to="/scenarios">
            <Button size="sm" variant="outline" className="gap-1.5 text-sm min-h-[44px]">
              View All Scenarios <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <PortfolioSummaryCards stats={stats} />

      {/* Tax Savings Breakdown */}
      <TaxSavingsBreakdown calculations={calculations} />

      {/* Cash Flow Chart */}
      <CashFlowChart calculations={calculations} />

      {/* Payout Tracker */}
      <PayoutTracker calculations={calculations} />

      {/* Project Table */}
      <ProjectBreakdownTable calculations={calculations} />

      {/* Disclaimer */}
      <div className="pb-4 pt-2 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Portfolio analytics are based on your saved calculation inputs and projections. Actual results will vary based on commodity prices, production rates, and market conditions. This is not investment advice.
        </p>
      </div>
    </div>
    </PullToRefresh>
  );
}