import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Activity, Layers, Radio, AlertTriangle,
  CheckCircle2, XCircle, HelpCircle, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    id: "seismic",
    icon: Radio,
    title: "Seismic Data Evaluation",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    intro: "Before investing, demand to see the seismic data. If the operator can't produce it — or won't let an independent geologist review it — that's a major red flag.",
    items: [
      {
        label: "2D vs 3D Seismic Coverage",
        ask: "Has a 3D seismic survey been shot over the prospect?",
        greenFlag: "Full 3D coverage over the drill site and surrounding area. 3D data dramatically reduces dry hole risk.",
        redFlag: "Only 2D lines available, or no seismic at all. Operator relying on 'geology by analogy' or offset well data alone.",
        detail: "3D seismic creates a subsurface cube of data that lets geophysicists map structure, fault planes, and reservoir boundaries in three dimensions. 2D only gives cross-sections — you're making assumptions between lines."
      },
      {
        label: "Structural Mapping & Trap Identification",
        ask: "What type of trap is the target? Is it clearly defined on seismic?",
        greenFlag: "Well-defined structural closure (anticline, faulted trap) with clear four-way or three-way dip closure visible on time-structure maps.",
        redFlag: "Vague or poorly imaged structure. Stratigraphic traps without seismic attribute support. Operator can't show you a structure map.",
        detail: "A structural trap (anticline, fault block) is the most reliable type. Stratigraphic traps (pinch-outs, reefs, unconformities) can hold massive reserves but are harder to image and carry higher geological risk."
      },
      {
        label: "AVO / Amplitude Analysis",
        ask: "Are there amplitude anomalies (bright spots or dim spots) supporting hydrocarbon presence?",
        greenFlag: "AVO (Amplitude vs. Offset) analysis shows Class II or III anomalies consistent with gas or light oil at the target depth. Supported by rock physics modeling.",
        redFlag: "No AVO work done. Or operator claims 'bright spots' without proper analysis — bright spots can also be coal, volcanics, or brine-filled sands.",
        detail: "AVO analysis examines how seismic amplitude changes with distance from the source. Certain patterns (Class III bright spots in clastic reservoirs) are strong hydrocarbon indicators. But AVO alone is not proof — it must be calibrated to well control."
      },
      {
        label: "Seismic Inversion & Attribute Analysis",
        ask: "Has acoustic impedance inversion or spectral decomposition been run?",
        greenFlag: "Post-stack or pre-stack inversion has been performed, showing low impedance zones at the target. Spectral decomposition reveals channel geometries or reef buildups.",
        redFlag: "No inversion or attribute analysis. Operator only showing raw amplitude maps without proper processing.",
        detail: "Seismic inversion converts reflectivity data into rock property estimates (impedance, density). This helps distinguish pay from non-pay. Spectral decomposition breaks down frequency content to reveal thin beds and depositional features invisible on broadband data."
      },
    ],
  },
  {
    id: "mudlog",
    icon: Layers,
    title: "Mud Log Analysis",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    intro: "The mud log is the real-time record of what was drilled through. It tells you whether hydrocarbons were actually encountered — or if the operator is selling you a dry hole.",
    items: [
      {
        label: "Gas Shows (Total Gas & Components)",
        ask: "What were the total gas readings through the target zone? What was the gas composition (C1–C5)?",
        greenFlag: "Sustained elevated total gas (background gas increase 2x–10x) through the pay zone. Heavier components (C2–C5) present indicating thermogenic (oil-associated) gas, not just biogenic methane.",
        redFlag: "No significant gas shows. Only trace methane (C1) — could be background or biogenic. Operator claiming 'excellent shows' but can't produce the mud log.",
        detail: "The mud log gas chromatograph breaks down gas into methane (C1), ethane (C2), propane (C3), butane (C4), and pentane (C5). A 'wet' gas ratio (high C2+) suggests oil. Dry gas (almost all C1) in an oil play is a warning. The 'gas ratio' analysis (C1/C2, iC4/nC4) helps determine oil vs gas vs condensate."
      },
      {
        label: "Rate of Penetration (ROP)",
        ask: "Did the ROP change significantly in the target zone?",
        greenFlag: "A 'drilling break' — sudden increase in ROP — through a porous, permeable reservoir section. Combined with gas shows, this is a strong positive indicator.",
        redFlag: "Uniform ROP with no drilling breaks. The target zone drilled like the surrounding tight rock — suggests poor porosity/permeability.",
        detail: "Porous rock drills faster than tight rock. A drilling break followed by gas shows is the mud logger's equivalent of 'hitting pay.' But ROP alone isn't diagnostic — soft shales also drill fast. Always correlate with gas shows and cuttings analysis."
      },
      {
        label: "Cuttings Description & Lithology",
        ask: "What did the rock cuttings look like through the target interval? Any oil staining or fluorescence?",
        greenFlag: "Sandstone or carbonate cuttings with visible oil staining (brown to dark brown), cut fluorescence under UV light (gold, blue-white, or yellow streaming cut), and good porosity estimates.",
        redFlag: "Tight carbonates, siltstones, or shales with no staining. Dull or no fluorescence. Operator claiming 'good porosity' but mud log shows tight lithology.",
        detail: "The mud logger examines cuttings under UV light and applies solvent cuts (acetone, chlorothene). Live oil fluoresces — the color and speed of cut indicate oil gravity. Fast, bright fluorescence = light oil. Slow, dull = heavy. No fluorescence through the pay zone is a bad sign."
      },
      {
        label: "Connection Gas & Trip Gas",
        ask: "Were there connection gas spikes or trip gas events through the target zone?",
        greenFlag: "Connection gas (gas surges when pumps stop for pipe connections) significantly above background through the pay zone — indicates a permeable, gas/oil-bearing formation that flows when pressure is reduced.",
        redFlag: "No connection gas through the target interval despite claims of pay. This suggests the zone is either tight or water-bearing.",
        detail: "When the pumps stop for a connection, hydrostatic pressure drops slightly. If the formation is permeable and hydrocarbon-bearing, formation fluids flow into the wellbore causing a gas spike. This is one of the best mud log indicators of producible pay."
      },
    ],
  },
  {
    id: "elogs",
    icon: Activity,
    title: "Electric Log Interpretation",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    intro: "Electric logs (wireline logs) are the gold standard for evaluating a well. If the operator won't share logs — or only shows you selected intervals — walk away.",
    items: [
      {
        label: "Resistivity Logs (Deep & Shallow)",
        ask: "What do the deep resistivity readings show through the pay zone? Is there separation between deep and shallow curves?",
        greenFlag: "High deep resistivity (>20 Ω·m in clastics, >100 Ω·m in carbonates) through the target zone, indicating hydrocarbons displacing conductive formation water. Separation between deep and shallow resistivity suggests an invaded zone (moveable hydrocarbons).",
        redFlag: "Low resistivity through the target — the zone is likely water-bearing. No separation between curves — no invasion, no moveable hydrocarbons. Very high resistivity everywhere could just be tight, non-porous rock.",
        detail: "Hydrocarbons are electrical insulators — they increase formation resistivity. The deep reading (LLD/ILD) measures the uninvaded zone; the shallow (LLS/SFL) reads the flushed zone. In a good oil zone, deep resistivity is high (original oil) and shallow is lower (mud filtrate invasion replaced some oil). This 'invasion profile' confirms moveable hydrocarbons."
      },
      {
        label: "Porosity Logs (Neutron-Density Crossplot)",
        ask: "What are the neutron porosity and bulk density readings? Do they cross over?",
        greenFlag: "Neutron-density crossover (neutron reading less than density porosity) in sandstone — the classic gas indicator. For oil, both logs should read reasonable porosity (>8–10% for conventional plays, >4% for tight oil) with good agreement.",
        redFlag: "Very low porosity on both curves (<4% in conventional reservoirs). Neutron and density reading the same in a supposed gas zone (no gas effect). Caliper washout causing bad readings.",
        detail: "The neutron log responds to hydrogen (water + hydrocarbons). The density log measures electron density (rock + fluid). In gas zones, the neutron reads low (gas has less hydrogen than liquid) while density reads high porosity (gas is less dense) — creating the famous 'crossover.' For oil, look for porosity >8% with consistent readings."
      },
      {
        label: "SP Log & Gamma Ray",
        ask: "Does the SP deflect negative (or GR read low) through the target zone?",
        greenFlag: "Strong negative SP deflection (or low GR reading <75 API) indicating clean sandstone or carbonate reservoir rock, distinguishable from surrounding shales.",
        redFlag: "Flat SP (shaly sand or tight formation) or high GR through the supposed pay zone — you may be looking at shale, not reservoir rock. A 'hot' GR anomaly could indicate organic-rich source rock (good for unconventional plays, not for conventional).",
        detail: "The Spontaneous Potential (SP) log measures natural electrical potential. In permeable sands, SP deflects negative relative to the shale baseline. The Gamma Ray (GR) measures natural radioactivity — clean sands/carbonates read low (<75 API), shales read high. These logs identify reservoir vs. non-reservoir."
      },
      {
        label: "Water Saturation (Sw) Calculation",
        ask: "What is the calculated water saturation in the pay zone? What Rw and 'a', 'm', 'n' values were used?",
        greenFlag: "Sw < 50% (ideally 20–40%) calculated using Archie's equation with appropriate parameters for the formation. The operator can document Rw (formation water resistivity) from water samples or SP-derived values.",
        redFlag: "Sw > 60% — the zone is likely water-productive. Operator doesn't know or won't share the Sw calculation. Using inappropriate Archie parameters (wrong cementation exponent for the rock type).",
        detail: "Water saturation (Sw) tells you what percentage of pore space is water vs. hydrocarbons. Archie's equation: Sw = ((a × Rw) / (φ^m × Rt))^(1/n). Below ~50% Sw, the zone should produce hydrocarbons. Above ~60%, expect mostly water. The 'irreducible water saturation' (Swi) for the rock type sets the theoretical minimum."
      },
    ],
  },
  {
    id: "risk",
    icon: AlertTriangle,
    title: "Geological Risk Checklist",
    color: "text-flare-red",
    bg: "bg-flare-red/10",
    intro: "Every oil and gas investment carries geological risk. The question isn't whether risk exists — it's whether the operator has properly quantified it and whether you're being compensated for it.",
    items: [
      {
        label: "Source Rock Maturity",
        ask: "Is there a proven, mature source rock in the basin? Has kerogen typing or vitrinite reflectance data been presented?",
        greenFlag: "The basin has proven source rocks (known oil/gas production from the target formation in nearby wells). Vitrinite reflectance (Ro) data shows the source is in the oil window (0.6–1.3%) or gas window (>1.3%).",
        redFlag: "Unproven source. The operator is drilling in a frontier area with no established petroleum system. No discussion of source rock in the PPM.",
        detail: "No source = no oil. The source rock must have been buried deep enough and heated long enough to generate hydrocarbons (thermal maturity). Vitrinite reflectance (Ro) is the standard measure. Oil window: 0.6–1.3% Ro. Wet gas: 1.0–1.3%. Dry gas: >1.3%. Immature: <0.6% — no generation."
      },
      {
        label: "Reservoir Quality & Deliverability",
        ask: "What is the expected porosity, permeability, and net pay thickness? Are there analog wells nearby?",
        greenFlag: "Offset wells within 1–2 miles show >8% porosity, >0.1 mD permeability (conventional), and >20 ft net pay. Formation test data (DST/MDT) from analogs confirms deliverability.",
        redFlag: "No nearby well control. Operator extrapolating reservoir quality from wells 10+ miles away or in a different formation. No formation test data available.",
        detail: "Porosity stores oil; permeability lets it flow. A high-porosity, low-permeability reservoir (tight sand, shale) may hold oil but won't produce at economic rates without stimulation. Always ask for the porosity-permeability relationship and compare to analog completions."
      },
      {
        label: "Seal & Migration Pathway",
        ask: "What is the top seal? Is there evidence of seal integrity (no breached structures nearby)?",
        greenFlag: "Thick, laterally continuous shale or evaporite seal overlying the reservoir. No evidence of fault-breaching through the seal. Nearby producing fields confirm trap-seal integrity.",
        redFlag: "Thin or questionable seal. Faulting cuts through the caprock. Nearby dry holes on similar structures suggest seal failure or lack of charge.",
        detail: "Without a seal, hydrocarbons migrate to the surface and are lost. The best seals are thick shales (>50 ft), salt, or anhydrite. Faults can be sealing or leaking — depends on the material in the fault plane (clay smear = sealing; sand-on-sand juxtaposition = leaking)."
      },
      {
        label: "Drilling & Completion Risk",
        ask: "What are the known drilling hazards? What completion method is planned?",
        greenFlag: "The operator has drilled multiple wells in the area. Known hazards (lost circulation zones, high-pressure zones, H2S) are addressed in the drilling plan. Completion method (frac, acid, natural flow) is proven in the area.",
        redFlag: "First well in a new area with unknown pressures. No mention of H2S risk. Operator planning an unproven completion technique. No contingency budget for drilling problems.",
        detail: "Even a geologically perfect prospect can fail due to drilling problems — stuck pipe, lost circulation, casing failure, blowouts. Ask about the AFE (Authorization for Expenditure) vs. actual costs on previous wells. If actuals consistently exceed AFE by >20%, the operator is either incompetent or deliberately low-balling costs to attract investors."
      },
    ],
  },
];

const references = [
  { label: "Texas RRC — Well & Production Data", url: "https://www.rrc.texas.gov/oil-and-gas/" },
  { label: "Oklahoma OCC — Well Records Search", url: "https://oklahoma.gov/occ/divisions/oil-gas.html" },
  { label: "North Dakota DMR — Well Lookup", url: "https://www.dmr.nd.gov/oilgas/" },
  { label: "USGS — Energy Resources Program", url: "https://www.usgs.gov/programs/energy-resources-program" },
  { label: "IHS / Enverus — Commercial Well Data", url: "https://www.enverus.com/" },
  { label: "State Geological Surveys", url: "https://www.stategeologists.org/" },
];

function SectionAccordion({ section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${section.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{section.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{section.intro}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-crude-gold/40 pl-3">
                {section.intro}
              </p>

              {section.items.map((item, i) => (
                <ItemCard key={i} item={item} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
            {index + 1}
          </span>
          {item.label}
          <ChevronDown className={`w-3 h-3 text-muted-foreground ml-auto shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </p>
      </button>

      <div className="pl-7 space-y-2">
        <div className="flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-primary dark:text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-foreground font-medium">{item.ask}</p>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-drill-green shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground"><strong className="text-drill-green">Green Flag:</strong> {item.greenFlag}</p>
        </div>

        <div className="flex items-start gap-2">
          <XCircle className="w-3.5 h-3.5 text-flare-red shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground"><strong className="text-flare-red">Red Flag:</strong> {item.redFlag}</p>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-1 p-2.5 rounded-lg bg-card border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GeoDueDiligence({ calcType }) {
  const contextTips = {
    net_investment: "Before committing capital, verify the geological basis for the operator's production projections. Your tax savings mean nothing if the well is a dry hole.",
    barrels_to_cash: "The production rates in your model above are only as good as the geology. Verify reservoir quality, decline drivers, and whether offset wells support these numbers.",
    natgas_to_cash: "Gas wells are particularly sensitive to reservoir permeability and completion quality. Make sure the geology supports the flow rates in your model.",
    rate_of_return: "Your IRR is based on production assumptions. If the geological data doesn't support those assumptions, your real return could be zero. Verify before you invest.",
  };

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-crude-gold/10 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-crude-gold" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Geological & Engineering Due Diligence</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {contextTips[calcType] || contextTips.net_investment}
          </p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-crude-gold/30 bg-crude-gold/5 dark:bg-crude-gold/5 p-4">
        <p className="text-xs text-foreground leading-relaxed font-medium">
          <strong className="text-crude-gold">The Oilman's Rule:</strong> "Numbers on a spreadsheet don't put oil in the tank. Seismic, mud logs, and electric logs do." — Before you trust any production forecast, make sure the subsurface data backs it up. Demand to see the data below, and have it reviewed by a qualified petroleum geologist or engineer independent of the operator.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <SectionAccordion key={section.id} section={section} />
        ))}
      </div>

      {/* Verification Resources */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-primary dark:text-accent" />
          Verify It Yourself — Public Data Sources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {references.map((ref) => (
            <a
              key={ref.label}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-foreground">{ref.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Important:</strong> This geological due diligence guide is educational — it does not constitute professional geological or engineering advice. Always engage a qualified, independent petroleum geologist or reservoir engineer to review subsurface data before making investment decisions. State-licensed Professional Geologists (P.G.) and Professional Engineers (P.E.) carry liability for their opinions. An operator's in-house geologist does not.
        </p>
      </div>
    </section>
  );
}