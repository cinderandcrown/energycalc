import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Search, FileText, Scale, Eye, DollarSign, Users, Phone, Globe,
  Siren, BookOpen, ClipboardCheck, HelpCircle, ArrowRight, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FraudPatternsTab from "../components/investor/FraudPatternsTab";
import PPMUploadAnalyzer from "../components/investor/PPMUploadAnalyzer";

// ─── PPM Red Flag Checklist ───────────────────────────────────────────────
const ppmRedFlags = [
  {
    category: "Ownership & Economics",
    icon: DollarSign,
    flags: [
      { label: "WI vs NRI spread is wider than 25%", critical: true, explanation: "A 75% WI with only 50% NRI means the operator is keeping an unusually large override. Industry standard is ~80% NRI on a 100% WI." },
      { label: "No stated gross WI/NRI — only 'net profits interest'", critical: true, explanation: "Net profits interests are easily manipulated. If costs never go to zero, you never see a dime. Demand working interest, not NPI." },
      { label: "Promote fee exceeds 20% of total deal", critical: false, explanation: "A 20–25% promote is standard. Anything above means the operator is taking an excessive override before investors see returns." },
      { label: "AFE (Authorization for Expenditure) is vague or absent", critical: true, explanation: "Without a line-item AFE, the operator can charge whatever they want to the well. This is how cost overruns become theft." },
      { label: "Payout structure favors operator before investor return of capital", critical: true, explanation: "Investors should receive 100% of net revenue until capital is returned. If the operator takes distributions before payout, run." },
      { label: "Turnkey price significantly exceeds AFE line-item total (JV deals)", critical: true, explanation: "In JV turnkey deals, compare the turnkey price to actual drilling costs. A >20% markup means the operator is profiting upfront before any production." },
      { label: "GP total fee load exceeds 25% of invested capital (LP deals)", critical: true, explanation: "Add up ALL GP fees: management, acquisition, drilling supervision, overhead, disposition, and carry. If total GP take exceeds 25% before LP payout, the economics are stacked against you." },
    ]
  },
  {
    category: "LP-Specific Red Flags",
    icon: Users,
    flags: [
      { label: "'Blind pool' — wells not identified at time of investment", critical: true, explanation: "If the GP hasn't identified specific prospects, you're giving them a blank check. Demand prospect details, target formations, and offset well data before committing." },
      { label: "Open-ended capital call provisions with no cap", critical: true, explanation: "An uncapped capital call means the GP can demand more money for 'completion costs' or 'workovers' with no limit. Your exposure is theoretically unlimited." },
      { label: "GP defines 'payout' to include their own fees and overhead", critical: true, explanation: "If GP overhead is included in the payout calculation, LPs must cover the GP's costs before seeing returns. Payout should be based on LP invested capital only." },
      { label: "No LP advisory committee or investor vote on major decisions", critical: false, explanation: "Best-practice LP agreements include an advisory committee that must approve wells, dispositions, and expenditures above a threshold. Without one, the GP has unchecked authority." },
      { label: "GP retains >25% carried interest through completion", critical: false, explanation: "A 15–20% GP carry is standard in drilling programs. Above 25% means the GP has significant free upside on your capital with no proportional risk." },
    ]
  },
  {
    category: "JV-Specific Red Flags",
    icon: Scale,
    flags: [
      { label: "No audit rights on operator books and JIBs", critical: true, explanation: "Without audit rights, you can't verify what the operator is actually spending. Industry-standard JOAs include annual audit rights for non-operators." },
      { label: "Operator uses affiliated service companies with no disclosure", critical: true, explanation: "If the operator's drilling company, SWD company, or pipeline company are related parties, all billings should be at arm's-length market rates, disclosed, and auditable." },
      { label: "Non-consent penalty exceeds 300%", critical: false, explanation: "Standard AAPL non-consent penalty is 200–300%. Anything above 300% is designed to punish investors who don't participate in every new well the operator proposes." },
      { label: "Operator has sole authority on all expenditures, no AFE approval process", critical: true, explanation: "The JOA should require investor approval (or at least notification) for expenditures above $25K–$50K. Sole operator discretion is a blank check." },
      { label: "No provision for operator replacement or removal by investors", critical: false, explanation: "If the operator performs poorly or commits fraud, investors should have a mechanism to vote for operator removal. Without it, you're locked in." },
    ]
  },
  {
    category: "Operator Transparency",
    icon: Eye,
    flags: [
      { label: "No third-party engineering report or reserve estimate", critical: true, explanation: "Any legitimate offering should have an independent petroleum engineer's report validating reserves and production estimates." },
      { label: "Operator is also the marketer, gatherer, and transporter", critical: false, explanation: "When the operator controls all midstream, they can inflate deductions against your royalty checks with no transparency." },
      { label: "Monthly statements are not guaranteed in writing", critical: true, explanation: "If monthly production and revenue statements aren't contractually required, you have no visibility into what the well is producing." },
      { label: "No audited financials or CPA-reviewed statements", critical: false, explanation: "Small operators may not have audited books but should at minimum have CPA-reviewed financial statements." },
      { label: "Operator refuses to provide state regulatory well records", critical: true, explanation: "All wells are registered with state oil & gas boards (e.g., TX RRC, OK OCC, MS OGB). An operator who won't share these is hiding something." },
    ]
  },
  {
    category: "Legal & Regulatory",
    icon: Scale,
    flags: [
      { label: "PPM is not filed with or exempt from SEC regulations", critical: true, explanation: "Offerings must either be registered with the SEC or qualify for an exemption (Reg D 506(b) or 506(c)). Ask for the Form D filing number." },
      { label: "Subscription agreement waives your right to sue", critical: true, explanation: "Mandatory arbitration clauses are common and legal, but outright liability waivers are a red flag in any investment." },
      { label: "No mention of operator's prior litigation or regulatory actions", critical: true, explanation: "Check PACER (federal courts), state court records, and the state oil & gas board for disciplinary actions or investor complaints." },
      { label: "Offering uses 'promissory note' structure instead of equity", critical: true, explanation: "Promissory notes are debt instruments. They're easier to hide, harder to enforce, and frequently used in oil & gas fraud schemes." },
      { label: "Operating agreement gives operator sole discretion on all expenses", critical: false, explanation: "Look for language like 'operator's reasonable judgment' on costs — this is a blank check. Costs should be capped or require investor approval above a threshold." },
    ]
  },
  {
    category: "Sales & Marketing Tactics",
    icon: Siren,
    flags: [
      { label: "High-pressure sales with limited-time urgency", critical: true, explanation: "Legitimate operators don't need to pressure you. 'This deal closes Friday' is a classic fraud tactic to prevent you from doing due diligence." },
      { label: "Cold call or unsolicited approach (not a pre-existing relationship)", critical: true, explanation: "Rule 506(b) exemptions require a pre-existing, substantive relationship with investors. Cold calling strangers is often a regulatory violation." },
      { label: "Returns promised as 'guaranteed' or 'risk-free'", critical: true, explanation: "Oil & gas is inherently speculative. Any guarantee of returns is either a lie or a violation of securities law. Period." },
      { label: "Testimonials and lifestyle marketing dominate (jets, ranches, trucks)", critical: false, explanation: "This is a psychological sales tactic. Legitimate operators lead with geology, engineering, and track record — not flex culture." },
      { label: "Website uses stock photos instead of actual well/field photos", critical: false, explanation: "Ask for GPS coordinates of the drill site and verify on Google Earth. If the photos are stock art, question what's real." },
    ]
  },
];

// ─── Due Diligence Checklist ──────────────────────────────────────────────
const ddChecklist = [
  { id: "dd1", label: "Run operator name through SEC EDGAR (sec.gov/cgi-bin/browse-edgar)", link: "https://www.sec.gov/cgi-bin/browse-edgar" },
  { id: "dd2", label: "Search FINRA BrokerCheck for the broker/promoter selling the deal", link: "https://brokercheck.finra.org/" },
  { id: "dd3", label: "Request the Form D filing number and verify on SEC.gov", link: "https://efts.sec.gov/LATEST/search-index?q=%22form+D%22&dateRange=custom" },
  { id: "dd4", label: "Verify well permits on the state oil & gas board website (TX RRC, OK OCC, MS OGB, etc.)", link: "https://www.rrc.texas.gov/" },
  { id: "dd5", label: "Search operator in your state's court records for investor lawsuits" },
  { id: "dd6", label: "Request the independent petroleum engineer's reserve report" },
  { id: "dd7", label: "Verify the operator's lease holdings with county deed records" },
  { id: "dd8", label: "Ask for audited or CPA-reviewed financials from the last 3 years" },
  { id: "dd9", label: "Request references from 3+ existing investors and actually call them" },
  { id: "dd10", label: "Confirm the offering is Reg D 506(b) or (c) and get the exemption number" },
  { id: "dd11", label: "Have an independent oil & gas attorney review the JOA and subscription agreement" },
  { id: "dd12", label: "Request monthly production reports from existing wells — verify against state records" },
];

// ─── Common Fraud Patterns ────────────────────────────────────────────────
const fraudPatterns = [
  // ── Promissory Note Deals ──
  {
    name: "The Promissory Note Trap",
    severity: "critical",
    dealType: "Promissory Note",
    description: "Operator offers a 'promissory note' paying 12–24% annual interest instead of equity ownership. Sounds like a bond — it's not. These are often unregistered securities, unsecured against any asset, and nearly impossible to collect on. When the operator goes under, note holders are last in line after everyone else.",
    warning: "Any oil & gas investment structured as a promissory note should be reviewed by a securities attorney before signing. Demand to know what assets secure the note and what happens in default."
  },
  // ── Limited Partnership (LP) Deals ──
  {
    name: "The LP Fee Stack / Promote Overload",
    severity: "critical",
    dealType: "Limited Partnership",
    description: "The GP structures the LP so they collect multiple layers of fees before investors see a dime: management fees (2–3%), acquisition fees (3–5%), drilling supervision fees (10–15%), disposition fees (2–3%), and a back-end carried interest (25–50% after payout). By the time all GP fees are paid, a well needs to produce 2–3x projections just for LPs to break even. This was the bread-and-butter structure of 1980s oil & gas tax shelters — and many modern programs use the same playbook.",
    warning: "Add up ALL GP fees — management, acquisition, drilling supervision, overhead, carry. If total GP compensation exceeds 20–25% of invested capital before LPs get a return, the economics are stacked against you. Compare to direct working interest deals where you own the production directly."
  },
  {
    name: "The LP 'Blind Pool' Gamble",
    severity: "high",
    dealType: "Limited Partnership",
    description: "LP offering raises capital for wells that haven't been identified yet — the so-called 'blind pool.' Investors commit $250K–$500K not knowing which leases, which basin, or even which state the wells will be drilled in. The GP has complete discretion to pick projects after they have your money. Some GPs deliberately choose marginal prospects after fundraising because better acreage was never available — they needed your money first.",
    warning: "Demand prospect-specific details BEFORE investing: target formation, lease location (section/township/range), offset well production data, and an independent engineering report. If the GP says 'trust us to pick good wells,' your money is better spent elsewhere."
  },
  {
    name: "The LP Capital Call Trap",
    severity: "high",
    dealType: "Limited Partnership",
    description: "LP agreement contains open-ended capital call provisions allowing the GP to demand additional funding for 'completion costs,' 'workover expenses,' or 'additional drilling.' Investors who don't pay the capital call face dilution, forfeiture of their interest, or conversion to a smaller NRI. Some GPs deliberately underfund initial drilling to force capital calls — capturing more money from committed investors who are afraid to lose their existing stake.",
    warning: "Read the capital call provisions line by line. Look for: maximum capital call amounts, caps on total investor commitment, and what happens if you don't participate. The best LP deals cap total investor exposure at 100–120% of initial commitment."
  },
  {
    name: "The LP 'Waterfall' Manipulation",
    severity: "high",
    dealType: "Limited Partnership",
    description: "Distribution waterfall looks fair on paper — '80% to LPs until payout, then 60/40 split.' But the GP defines 'payout' using total program costs including inflated management fees, affiliated service charges, and overhead allocations. True investor payout is pushed far into the future while the GP collects distributions from Day 1 via their fee structure.",
    warning: "Insist that 'payout' means return of INVESTOR capital only — not reimbursement of GP overhead. Model the waterfall yourself using the Rate of Return calculator with realistic production declines. If payout takes >36 months at projected rates, the deal may never pay out."
  },
  // ── Joint Venture (JV) Deals ──
  {
    name: "The JV 'Turnkey' Price Gouge",
    severity: "critical",
    dealType: "Joint Venture",
    description: "Operator offers a turnkey JV where you pay a fixed price per well (e.g., $400K for a 25% WI). The actual drilling cost is $250K total — meaning the operator pockets $150K in hidden markup before a single barrel is produced. You're paying $400K for a $62.5K well cost (your 25% share of $250K). The operator's 'skin in the game' is zero — they already profited at closing. Sites like oilcashflow.com and similar platforms historically promoted turnkey JV deals where the markup was buried in the turnkey price.",
    warning: "ALWAYS demand the AFE (Authorization for Expenditure) with line-item costs. Compare the turnkey price to the actual AFE. If the turnkey exceeds the AFE by more than 15–20%, the excess is pure operator profit — not drilling cost. Ask: 'What is the operator paying per well vs. what am I paying?'"
  },
  {
    name: "The JV 'Carried Interest' Illusion",
    severity: "high",
    dealType: "Joint Venture",
    description: "JV agreement states the operator is 'carried' through drilling — meaning investors pay 100% of drilling costs while the operator retains a significant working interest (25–50%) for free. This is pitched as 'the operator contributes the leases, you contribute the capital.' In reality, the leases may have been acquired for pennies per acre, and the operator is getting a free ride on your capital with no financial risk.",
    warning: "Calculate the value of the operator's lease contribution vs. your cash contribution. If you're paying $500K and the operator's leases cost $5K, you're funding a 100:1 leverage play for the operator. The carry should be proportional to the actual value contributed."
  },
  {
    name: "The JV 'Operator Controlled' Expenses",
    severity: "critical",
    dealType: "Joint Venture",
    description: "JV operating agreement (JOA) gives the operator sole authority over all expenditures, vendor selection, and well operations — with no cap, no competitive bidding requirement, and no investor approval threshold. The operator hires their own affiliated drilling company, saltwater disposal company, and pipeline company at above-market rates. Your monthly JIBs (Joint Interest Billings) eat up all production revenue. This is the #1 complaint in JV oil & gas deals.",
    warning: "The JOA should include: (1) AFE approval process for expenditures over $25K, (2) competitive bidding on services over $50K, (3) prohibition or disclosure of affiliated-party transactions, (4) monthly JIB detail with supporting invoices, (5) audit rights allowing investors to examine operator books annually."
  },
  {
    name: "The JV Non-Consent Penalty",
    severity: "high",
    dealType: "Joint Venture",
    description: "JV agreement includes a 'non-consent' clause: if the operator proposes a new well or workover and you decline to participate, you're penalized with a 200–500% cost recovery penalty. This means the participating parties recover 2–5x their costs from YOUR share of future production before you see another check. Operators use this to force investors into every new expenditure or strip their existing revenue.",
    warning: "Standard AAPL (American Association of Professional Landmen) non-consent penalty is 200–300% for development wells. Anything above 300% is aggressive. Some JOAs allow the operator to unilaterally propose wells — giving them the power to either drain your capital or dilute your interest. Negotiate a cap."
  },
  // ── Cross-Deal Patterns ──
  {
    name: "The Overriding Royalty Scheme",
    severity: "critical",
    dealType: "All Deal Types",
    description: "Operator sells working interest to investors (via LP, JV, or direct participation), then layers multiple overriding royalty interests (ORRIs) off the top — to himself, family members, or shell companies. By the time production revenue flows to investors, it's been bled dry by hidden royalty burdens not disclosed in the PPM. A 75% NRI on a 100% WI means 25% is going to royalties and overrides — if the operator holds a secret 10% ORRI on top of that, your effective NRI drops to 65%.",
    warning: "Demand a complete title opinion showing ALL royalty burdens on the leasehold before committing capital. Cross-reference the ORRI holders against the operator's principals, family, and affiliated entities."
  },
  {
    name: "The 'Proven Formation' Bait-and-Switch",
    severity: "high",
    dealType: "All Deal Types",
    description: "Operator shows you production data from a successful nearby well to imply your well will match it. The PPM vaguely references 'proven formations' but contains no engineering report. The nearby well may be in a different zone, different lease, or owned by someone else entirely. Common in LP programs and JV offerings targeting retail investors.",
    warning: "Insist on an independent 3rd-party engineering report specific to YOUR lease and target formation. Verify offset well data on the state oil & gas board website — don't take the operator's word for it."
  },
  {
    name: "The Cost Stuffing Operation",
    severity: "high",
    dealType: "All Deal Types",
    description: "Operator controls affiliated service companies (drilling contractor, saltwater disposal, pipeline transport). All costs are billed to the joint account at inflated rates through these related-party entities. Investor's revenue is consumed by these manufactured expenses. This affects LPs, JVs, and direct WI deals equally. Completely legal if disclosed — criminal if hidden.",
    warning: "JOA or LPA should require competitive bidding or market-rate caps on all affiliated-party transactions. You have the right to audit operator books in most agreements — exercise it."
  },
  {
    name: "The Dry Hole Rollover",
    severity: "high",
    dealType: "All Deal Types",
    description: "Well comes in dry or is plugged early. Operator immediately approaches investors with a 'new opportunity' to recover losses in another deal. Each new deal generates more upfront fees for the operator. The cycle repeats. Investors throw good money after bad chasing sunk costs. This is rampant in both LP programs and JV deal flow.",
    warning: "A dry hole is part of oil & gas risk. An operator who immediately pivots to selling you another deal may be fee-farming. Evaluate each deal independently — sunk costs are sunk."
  },
  {
    name: "The Regulation D Misuse",
    severity: "medium",
    dealType: "All Deal Types",
    description: "Operator claims Reg D exemption (no SEC registration required) but solicits investors via cold calls, social media, or public advertising — which is only allowed under 506(c) with verified accredited investors. Most small operators use 506(b) which strictly prohibits general solicitation. This applies to LPs, JVs, and promissory notes alike.",
    warning: "Ask whether the offering is 506(b) or 506(c) and whether you were cold-solicited. If yes, report to your state securities regulator."
  },
  {
    name: "The Phantom Well Scheme",
    severity: "critical",
    dealType: "All Deal Types",
    description: "Operator collects investor funds, claims to drill a well, and provides fabricated production reports and revenue statements. No well exists or drilling was abandoned early. Investor checks are funded by new investor money (Ponzi structure). When the new money dries up, the operation collapses and the operator disappears. Can be structured as LP, JV, or direct participation.",
    warning: "ALWAYS verify well status independently on the state oil & gas board website (TX RRC, OK OCC, etc.) using the API number. Request GPS coordinates and verify the drill site on satellite imagery."
  },
  {
    name: "The 'Tax Play' Misdirection",
    severity: "high",
    dealType: "All Deal Types",
    description: "Promoter sells the deal purely on tax benefits: 'Write off 85% of your investment in Year 1!' The focus on taxes distracts from terrible underlying economics — the well may never produce enough to generate meaningful returns. Tax deductions don't help if the investment itself goes to zero. Common in both LP and JV offerings targeting high-income professionals.",
    warning: "Tax benefits should enhance a good deal, not make a bad deal tolerable. Always model the investment BEFORE tax benefits using the Rate of Return calculator. If the pre-tax economics don't work, the deductions are just a smaller loss."
  },
];

// ─── Accreditation Guide ──────────────────────────────────────────────────
const accredReqs = [
  { label: "Income Test", value: "$200K+ individual income ($300K joint) for past 2 years, with expectation of same" },
  { label: "Net Worth Test", value: "$1M+ net worth, excluding primary residence" },
  { label: "Professional Test", value: "Series 7, 65, or 82 license holder in good standing" },
  { label: "Entity Test", value: "Entity with $5M+ in assets, or all equity owners are accredited" },
];

// ─── PPM Analyzer ─────────────────────────────────────────────────────────
function PPMAnalyzer() {
  const [ppmText, setPpmText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!ppmText.trim()) return;
    setLoading(true);
    setAnalysis(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a securities attorney and oil & gas fraud expert with 30 years of experience analyzing LP programs, Joint Venture agreements, promissory notes, direct participation programs (DPPs), and PPMs.

First, identify the DEAL STRUCTURE (Limited Partnership, Joint Venture, Promissory Note, Direct Working Interest, Royalty Purchase, or Other). Then analyze accordingly.

For LP deals, specifically check for: excessive GP fee stacking (management, acquisition, drilling supervision, disposition, carry), blind pool provisions, open-ended capital call clauses, waterfall manipulation, and whether LP interests are structured to avoid self-employment tax.

For JV deals, specifically check for: turnkey price markups vs actual AFE, carried interest imbalances, operator-controlled expenses with no caps or audit rights, non-consent penalty severity (>300% is aggressive), and affiliated-party service company billing.

For Promissory Notes, check for: whether the note is secured or unsecured, registration status, what happens in default, and whether this is really an unregistered security disguised as a note.

Document text to analyze:
"""
${ppmText}
"""

Return a JSON object with:
- "dealStructure": string (the type of deal: "Limited Partnership", "Joint Venture", "Promissory Note", "Direct Working Interest", "Royalty Purchase", or "Other/Unclear")
- "riskScore": number 1-10 (10 = extremely high risk / likely fraud)
- "riskLevel": "low" | "medium" | "high" | "critical"  
- "summary": 2-3 sentence plain-English summary of what this is offering and what structure it uses
- "redFlags": array of objects { flag: string (specific clause or issue found), severity: "low"|"medium"|"high"|"critical", explanation: string }
- "greenFlags": array of strings (positive indicators found, if any)
- "missingItems": array of strings (critical items that should be in any legitimate offering of this type but are absent)
- "feeAnalysis": string (breakdown of all fees, promotes, carries, and markups found — or "Not enough information to analyze fees")
- "verdict": string (2-3 sentences final verdict on whether to proceed and what to do next)

Be specific. Quote actual language from the text when citing red flags. Be harsh and direct — this protects real investor money. If the deal structure is unclear, say so and explain why that itself is a red flag.`,
      response_json_schema: {
        type: "object",
        properties: {
          dealStructure: { type: "string" },
          riskScore: { type: "number" },
          riskLevel: { type: "string" },
          summary: { type: "string" },
          redFlags: { type: "array", items: { type: "object", properties: { flag: { type: "string" }, severity: { type: "string" }, explanation: { type: "string" } } } },
          greenFlags: { type: "array", items: { type: "string" } },
          missingItems: { type: "array", items: { type: "string" } },
          feeAnalysis: { type: "string" },
          verdict: { type: "string" }
        }
      }
    });
    // Save paste submission to database
    await base44.entities.PPMSubmission.create({
      document_title: result.dealStructure || "Pasted Document",
      submission_type: "paste",
      text_length: ppmText.length,
      deal_structure: result.dealStructure || "Unknown",
      risk_score: result.riskScore,
      risk_level: result.riskLevel,
      red_flag_count: result.redFlags?.length || 0,
      green_flag_count: result.greenFlags?.length || 0,
      missing_item_count: result.missingItems?.length || 0,
      summary: result.summary,
      verdict: result.verdict,
      full_analysis: result,
    });

    setAnalysis(result);
    setLoading(false);
  };

  const riskColor = {
    low: "text-drill-green border-drill-green/40 bg-drill-green/10",
    medium: "text-crude-gold border-crude-gold/40 bg-crude-gold/10",
    high: "text-orange-500 border-orange-500/40 bg-orange-500/10",
    critical: "text-flare-red border-flare-red/40 bg-flare-red/10",
  };

  const sevColor = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-crude-gold/10 text-crude-gold",
    high: "bg-orange-500/10 text-orange-500",
    critical: "bg-flare-red/10 text-flare-red",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-flare-red/30 bg-flare-red/5 p-4">
        <div className="flex gap-2 items-start">
          <ShieldAlert className="w-4 h-4 text-flare-red mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">AI Deal Analyzer:</strong> Paste text from any oil & gas offering — LP agreement, JV contract, PPM, subscription agreement, promissory note, or direct participation program. Our AI identifies the deal structure, flags investor risks, analyzes fee stacking, and spots fraud patterns specific to that deal type. <strong className="text-foreground">This does not constitute legal advice.</strong> Always consult a licensed securities attorney before investing.
          </p>
        </div>
      </div>

      <Textarea
        placeholder={`Paste your LP agreement, JV contract, PPM, promissory note, or any offering document here...\n\nExamples:\n• LP: "Limited Partner shall contribute $250,000 for a 2% LP interest. GP receives 25% carried interest after 150% payout..."\n• JV: "Investor agrees to pay $400,000 turnkey for a 25% WI in the Smith #1 well, operated by ABC Energy LLC..."\n• Note: "Promissory note in the amount of $100,000 at 18% annual interest, payable quarterly..."`}
        value={ppmText}
        onChange={(e) => setPpmText(e.target.value)}
        className="h-40 text-sm font-mono resize-none"
      />

      <Button
        onClick={analyze}
        disabled={!ppmText.trim() || loading}
        className="w-full gap-2 bg-flare-red hover:bg-flare-red/90 text-white"
      >
        <Search className="w-4 h-4" />
        {loading ? "Analyzing for Red Flags..." : "Analyze This Document"}
      </Button>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Risk Score */}
          <div className={`rounded-xl border p-4 ${riskColor[analysis.riskLevel] || riskColor.medium}`}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm uppercase tracking-wide">Risk Assessment</span>
                {analysis.dealStructure && (
                  <Badge className="bg-background/50 border border-current text-[10px] font-bold">{analysis.dealStructure}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl">{analysis.riskScore}/10</span>
                <Badge className={`${riskColor[analysis.riskLevel]} border font-bold uppercase text-xs`}>
                  {analysis.riskLevel}
                </Badge>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Fee Analysis */}
          {analysis.feeAnalysis && (
            <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
              <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Fee & Cost Analysis
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{analysis.feeAnalysis}</p>
            </div>
          )}

          {/* Verdict */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Verdict</p>
            <p className="text-sm font-medium text-foreground leading-relaxed">{analysis.verdict}</p>
          </div>

          {/* Red Flags */}
          {analysis.redFlags?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-flare-red uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4" /> Red Flags ({analysis.redFlags.length})
              </h3>
              <div className="space-y-2">
                {analysis.redFlags.map((f, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-start gap-2 mb-1">
                      <Badge className={`${sevColor[f.severity] || sevColor.medium} border-0 text-[10px] font-semibold uppercase shrink-0`}>{f.severity}</Badge>
                      <p className="text-xs font-semibold text-foreground leading-snug">{f.flag}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-1">{f.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Green Flags */}
          {analysis.greenFlags?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-drill-green uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Positive Indicators
              </h3>
              <div className="space-y-1">
                {analysis.greenFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-drill-green/5 border border-drill-green/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-drill-green mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Items */}
          {analysis.missingItems?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-crude-gold uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Missing From This Document
              </h3>
              <div className="space-y-1">
                {analysis.missingItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-crude-gold/5 border border-crude-gold/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-crude-gold mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────
function CollapsibleCard({ title, subtitle, icon: Icon, iconColor = "text-crude-gold", children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function InvestorProtection() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Hero Banner */}
      <div className="rounded-2xl border-2 border-flare-red/40 bg-gradient-to-br from-[#3d0000] via-[#1a0000] to-petroleum dark:from-card dark:via-card dark:to-card/80 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-flare-red/20 border border-flare-red/40 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-flare-red" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Investor Protection Center</h1>
            <p className="text-white/60 text-xs">Know before you sign. Protect your capital.</p>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-2">
          The oil & gas industry has produced extraordinary wealth — and extraordinary fraud. From LP fee stacking to JV turnkey gouging, promissory note traps, and phantom well Ponzi schemes — bad actors hide behind complex offering documents, shell companies, and slick websites. <strong className="text-white">This guide covers every deal structure: LP programs, Joint Ventures, promissory notes, and direct participation.</strong>
        </p>
        <p className="text-white/60 text-xs leading-relaxed mb-4">
          Use our <strong className="text-crude-gold">AI Deal Analyzer</strong> to scan any LP agreement, JV offering, PPM, or promissory note. Review {fraudPatterns.length} documented fraud patterns across all deal types, check 20+ red flags, and follow a 12-step due diligence checklist. Then use the <a href="/operator-screener" className="text-crude-gold underline underline-offset-2">Operator Screener</a> to vet the company itself.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: "$10B+", label: "Lost to oil & gas fraud annually (FBI est.)" },
            { val: "80%", label: "Of small oil deals never pay investor return of capital" },
            { val: "506(b)", label: "The exemption that lets operators skip SEC review" },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="font-mono font-bold text-crude-gold text-base">{item.val}</p>
              <p className="text-white/50 text-[10px] leading-tight mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="w-full grid grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger value="upload" className="text-xs py-2">Upload PPM</TabsTrigger>
          <TabsTrigger value="analyzer" className="text-xs py-2">Paste Text</TabsTrigger>
          <TabsTrigger value="redflags" className="text-xs py-2">Red Flags</TabsTrigger>
          <TabsTrigger value="duediligence" className="text-xs py-2">Due Diligence</TabsTrigger>
          <TabsTrigger value="fraudpatterns" className="text-xs py-2">Fraud Patterns</TabsTrigger>
        </TabsList>

        {/* ── Tab 0: Upload PPM ── */}
        <TabsContent value="upload" className="mt-4">
          <PPMUploadAnalyzer />
        </TabsContent>

        {/* ── Tab 1: AI Analyzer (Paste Text) ── */}
        <TabsContent value="analyzer" className="mt-4">
          <PPMAnalyzer />
        </TabsContent>

        {/* ── Tab 2: Red Flags ── */}
        <TabsContent value="redflags" className="mt-4 space-y-3">
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review your PPM or JV agreement against each of these categories. <Badge className="bg-flare-red/10 text-flare-red border-0 text-[10px] font-bold">CRITICAL</Badge> flags are potential deal-killers. <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-[10px] font-bold">WARNING</Badge> flags require further investigation.
            </p>
          </div>
          {ppmRedFlags.map((section) => {
            const Icon = section.icon;
            return (
              <CollapsibleCard
                key={section.category}
                title={section.category}
                subtitle={`${section.flags.filter(f => f.critical).length} critical · ${section.flags.filter(f => !f.critical).length} warning`}
                icon={Icon}
                defaultOpen={section.category === "Ownership & Economics"}
              >
                <div className="space-y-3">
                  {section.flags.map((flag, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${flag.critical ? "border-flare-red/30 bg-flare-red/5" : "border-crude-gold/30 bg-crude-gold/5"}`}>
                      <div className="flex items-start gap-2 mb-1.5">
                        {flag.critical
                          ? <XCircle className="w-4 h-4 text-flare-red mt-0.5 shrink-0" />
                          : <AlertTriangle className="w-4 h-4 text-crude-gold mt-0.5 shrink-0" />
                        }
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{flag.label}</p>
                            <Badge className={`border-0 text-[10px] font-bold ${flag.critical ? "bg-flare-red/10 text-flare-red" : "bg-crude-gold/10 text-crude-gold"}`}>
                              {flag.critical ? "CRITICAL" : "WARNING"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{flag.explanation}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            );
          })}
        </TabsContent>

        {/* ── Tab 3: Due Diligence ── */}
        <TabsContent value="duediligence" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Pre-Investment Checklist</h3>
              <Badge className="bg-primary/10 text-primary dark:text-accent border-0 font-mono">
                {checkedCount}/{ddChecklist.length} complete
              </Badge>
            </div>
            <div className="space-y-2">
              {ddChecklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                    checkedItems[item.id]
                      ? "border-drill-green/40 bg-drill-green/5"
                      : "border-border bg-background hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                    checkedItems[item.id] ? "bg-drill-green border-drill-green" : "border-muted-foreground"
                  }`}>
                    {checkedItems[item.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs leading-relaxed ${checkedItems[item.id] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.label}
                    </p>
                    {item.link && !checkedItems[item.id] && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-primary dark:text-accent hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <ArrowRight className="w-2.5 h-2.5" /> Open resource
                      </a>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accredited Investor Requirements */}
          <CollapsibleCard
            title="Accredited Investor Requirements"
            subtitle="You must qualify before legally investing in most oil & gas PPMs"
            icon={Users}
            iconColor="text-primary dark:text-accent"
          >
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Under SEC Regulation D, oil & gas PPMs are typically restricted to <strong className="text-foreground">accredited investors</strong>. If an operator sold you a deal without verifying your accreditation status, that's a securities law violation you can use against them.</p>
              {accredReqs.map((r) => (
                <div key={r.label} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-drill-green mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          {/* Where to Report */}
          <CollapsibleCard
            title="Where to Report Oil & Gas Fraud"
            subtitle="If you've been defrauded, these are your options"
            icon={Phone}
            iconColor="text-flare-red"
          >
            <div className="space-y-2">
              {[
                { name: "SEC Enforcement (tips.sec.gov)", url: "https://tips.sec.gov/", desc: "Report securities fraud, unregistered offerings, and Reg D violations. You may be eligible for a whistleblower award." },
                { name: "FBI Financial Crimes (ic3.gov)", url: "https://www.ic3.gov/", desc: "Federal wire fraud and mail fraud in oil & gas investments. File an IC3 complaint." },
                { name: "Your State Securities Regulator (NASAA)", url: "https://www.nasaa.org/", desc: "NASAA links to all 50 state securities regulators who investigate intrastate oil & gas fraud." },
                { name: "FINRA (brokercheck.finra.org)", url: "https://brokercheck.finra.org/", desc: "Report broker-dealers and registered reps who sold unsuitable or fraudulent investments." },
                { name: "Your State Oil & Gas Board", url: "https://www.rrc.texas.gov/", desc: "Can revoke operator permits and force accounting audits of production and revenue." },
              ].map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors block">
                  <Globe className="w-3.5 h-3.5 text-primary dark:text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </CollapsibleCard>
        </TabsContent>

        {/* ── Tab 4: Fraud Patterns ── */}
        <TabsContent value="fraudpatterns" className="mt-4 space-y-3">
          <FraudPatternsTab fraudPatterns={fraudPatterns} />

        </TabsContent>
      </Tabs>
    </div>
  );
}