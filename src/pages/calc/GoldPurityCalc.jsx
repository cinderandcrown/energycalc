import { useState, useMemo } from "react";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LivePriceBar from "@/components/calc/LivePriceBar";
import UpgradeNudge from "@/components/UpgradeNudge";
import useCommodityPrices from "@/hooks/useCommodityPrices";
import { motion } from "framer-motion";

const KARAT_PURITY = {
  24: 0.999, 22: 0.9167, 18: 0.750, 14: 0.5833, 10: 0.4167, 9: 0.375,
};
const KARAT_OPTIONS = Object.keys(KARAT_PURITY).map(Number).sort((a, b) => b - a);
const TROY_OZ_PER_GRAM = 0.032151;

const DEFAULTS = {
  weightGrams: 31.1,
  karat: 24,
  spotOverride: 0,
  premiumPct: 3,
  quantity: 1,
};

export default function GoldPurityCalc() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);
  const { commodities, loading: priceLoading, refresh } = useCommodityPrices("precious_metals");

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const goldSpot = commodities.find(c => c.symbol === "XAU" || c.name?.toLowerCase().includes("gold"));
  const silverSpot = commodities.find(c => c.symbol === "XAG" || c.name?.toLowerCase().includes("silver"));
  const platinumSpot = commodities.find(c => c.symbol === "XPT" || c.name?.toLowerCase().includes("platinum"));

  const liveGoldPrice = goldSpot?.price || 0;
  const effectiveSpot = inputs.spotOverride > 0 ? inputs.spotOverride : liveGoldPrice;

  const results = useMemo(() => {
    const { weightGrams, karat, premiumPct, quantity } = inputs;
    const purity = KARAT_PURITY[karat] || 0;
    const pureGoldGrams = weightGrams * purity;
    const pureGoldTroyOz = pureGoldGrams * TROY_OZ_PER_GRAM;
    const meltValue = pureGoldTroyOz * effectiveSpot;
    const premiumValue = meltValue * (premiumPct / 100);
    const totalPerUnit = meltValue + premiumValue;
    const totalValue = totalPerUnit * quantity;
    const pricePerGram = weightGrams > 0 ? totalPerUnit / weightGrams : 0;

    return {
      purity: purity * 100,
      pureGoldGrams,
      pureGoldTroyOz,
      meltValue,
      premiumValue,
      totalPerUnit,
      totalValue,
      pricePerGram,
    };
  }, [inputs, effectiveSpot]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gold Purity & Value Calculator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Calculate gold value by karat, weight, and live spot price</p>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} calcType="gold_purity" inputs={inputs} results={results} />
      </div>

      <LivePriceBar
        items={[
          { label: "Gold", price: goldSpot?.price, change: goldSpot?.changePct, unit: "/oz" },
          { label: "Silver", price: silverSpot?.price, change: silverSpot?.changePct, unit: "/oz" },
          { label: "Platinum", price: platinumSpot?.price, change: platinumSpot?.changePct, unit: "/oz" },
        ]}
        loading={priceLoading}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Gold Parameters</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Karat (Purity)</label>
            <div className="flex flex-wrap gap-2">
              {KARAT_OPTIONS.map(k => (
                <button
                  key={k}
                  onClick={() => set("karat")(k)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold border transition-colors ${
                    inputs.karat === k
                      ? "bg-crude-gold text-petroleum border-crude-gold"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {k}K
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{inputs.karat}K = {(KARAT_PURITY[inputs.karat] * 100).toFixed(1)}% pure gold</p>
          </div>

          <InputWithSlider label="Weight (grams)" value={inputs.weightGrams} onChange={set("weightGrams")} min={0.1} max={1000} step={0.1} suffix="g" tooltip="Total weight of the gold item including alloy metals." />
          <InputWithSlider label="Quantity" value={inputs.quantity} onChange={set("quantity")} min={1} max={100} step={1} tooltip="Number of identical items." />
          <InputWithSlider label="Dealer Premium (%)" value={inputs.premiumPct} onChange={set("premiumPct")} min={0} max={30} step={0.5} suffix="%" tooltip="Markup over melt value — typically 2-8% for bullion, higher for jewelry." />
          <InputWithSlider label="Manual Spot Override ($/oz)" value={inputs.spotOverride} onChange={set("spotOverride")} min={0} max={5000} step={10} prefix="$" tooltip="Leave at 0 to use live spot price. Set a value to override." />

          {effectiveSpot > 0 && (
            <div className="p-3 rounded-lg bg-crude-gold/10 border border-crude-gold/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Using Spot:</strong>{" "}
                <span className="font-mono text-crude-gold font-bold">${effectiveSpot.toLocaleString("en-US", { minimumFractionDigits: 2 })}/oz</span>
                {inputs.spotOverride > 0 && <span className="text-muted-foreground ml-1">(manual)</span>}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <HeroResultCard label="Total Value" value={results.totalValue} sublabel={inputs.quantity > 1 ? `${inputs.quantity} items × $${results.totalPerUnit.toLocaleString("en-US", { minimumFractionDigits: 2 })} each` : `Melt + ${inputs.premiumPct}% premium`} />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Melt Value" value={results.meltValue} />
            <ResultCard label="Premium" value={results.premiumValue} />
            <ResultCard label="Pure Gold Content" value={results.pureGoldGrams} prefix="" suffix="g" />
            <ResultCard label="Price per Gram" value={results.pricePerGram} />
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground">Breakdown</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Weight</span><span className="font-mono text-foreground">{inputs.weightGrams}g × {inputs.quantity}</span></div>
              <div className="flex justify-between"><span>Purity ({inputs.karat}K)</span><span className="font-mono text-foreground">{results.purity.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span>Pure Gold</span><span className="font-mono text-foreground">{results.pureGoldTroyOz.toFixed(4)} troy oz</span></div>
              <div className="flex justify-between"><span>Spot Price</span><span className="font-mono text-foreground">${effectiveSpot.toLocaleString("en-US", { minimumFractionDigits: 2 })}/oz</span></div>
              <div className="flex justify-between border-t border-border pt-1.5"><span className="font-semibold text-foreground">Melt Value</span><span className="font-mono font-bold text-foreground">${results.meltValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span>+ {inputs.premiumPct}% Premium</span><span className="font-mono text-foreground">${results.premiumValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between border-t border-border pt-1.5"><span className="font-bold text-crude-gold">Total</span><span className="font-mono font-bold text-crude-gold">${results.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
            </div>
          </motion.div>
        </div>
      </div>

      <UpgradeNudge />
      <DisclaimerFooter />
      <SaveCalcModal open={saveOpen} onClose={() => setSaveOpen(false)} calcType="gold_purity" inputs={inputs} results={results} />
    </div>
  );
}