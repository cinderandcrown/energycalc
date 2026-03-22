import { CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

const formDFields = [
  { field: "Issuer Name & Address", what: "The legal entity selling the securities. Check if it matches the name in the PPM. Shell companies or recently formed LLCs warrant extra scrutiny." },
  { field: "Related Persons", what: "Officers, directors, and promoters involved. Search each name on FINRA BrokerCheck and SEC EDGAR for prior enforcement actions." },
  { field: "Industry Group", what: "Should match the deal type. Oil & gas offerings use SIC codes 1311 (Crude Petroleum & Natural Gas) or 1382 (Oil & Gas Field Services)." },
  { field: "Exemption(s) Claimed", what: "Which Reg D rule is used — 504, 506(b), or 506(c). This tells you whether advertising was legal and whether non-accredited investors can participate." },
  { field: "Type of Securities Offered", what: "Equity, debt, limited partnership interests, or membership units. Know what you're buying and what rights it gives you." },
  { field: "Minimum Investment Accepted", what: "The smallest check the issuer will accept. Very low minimums ($5,000–$10,000) in oil & gas deals can be a sign of retail-targeting fraud." },
  { field: "Total Offering Amount", what: "How much the issuer is trying to raise. Compare this to the project scope described in the PPM — does the amount make sense for the stated drilling program?" },
  { field: "Total Amount Sold", what: "How much has been raised so far. A large gap between offering amount and amount sold may indicate difficulty raising capital." },
  { field: "Number of Investors", what: "Total investor count and breakdown by accredited/non-accredited. A 506(b) with many non-accredited investors triggers additional disclosure obligations." },
  { field: "Sales Commissions & Finders Fees", what: "How much is being paid to sell the deal. Commissions over 10% are a red flag. Over 15% is predatory." },
  { field: "Use of Proceeds", what: "Not detailed on Form D itself, but should be clearly stated in the PPM. If the Form D shows high commissions and the PPM is vague on use of proceeds, proceed with extreme caution." },
];

export default function FormDExplainer() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 dark:border-accent/30 pl-3">
        <strong className="text-foreground">Form D</strong> is a brief notice filed with the SEC by companies selling securities under Regulation D. 
        It is NOT an approval — the SEC does not review the offering. But it IS public record, and you can verify an offering's legitimacy by searching for it on the SEC's EDGAR database.
      </p>

      <div className="rounded-lg bg-crude-gold/5 border border-crude-gold/20 p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-crude-gold shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Critical:</strong> Form D must be filed within 15 days of the first sale of securities. If a company is selling Reg D securities and has NOT filed a Form D, this is a significant compliance failure — and potentially a sign of fraud. Always search EDGAR before investing.
        </p>
      </div>

      <h3 className="text-sm font-bold text-foreground">What to Check on a Form D Filing</h3>

      <div className="space-y-2">
        {formDFields.map((f) => (
          <div key={f.field} className="rounded-lg border border-border/50 bg-card p-3">
            <p className="text-xs font-semibold text-foreground mb-1">{f.field}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.what}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-card border border-border p-3">
        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <ExternalLink className="w-3.5 h-3.5 text-primary dark:text-accent" />
          How to Search Form D Filings
        </p>
        <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal pl-4">
          <li>Go to <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=D&dateb=&owner=include&count=40&search_text=&action=getcompany" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline underline-offset-2">SEC EDGAR Full-Text Search</a></li>
          <li>Enter the company name or CIK number in the search field</li>
          <li>Filter by Form Type "D" or "D/A" (amendment)</li>
          <li>Review the filing details — pay close attention to dates, amounts, and related persons</li>
          <li>Cross-reference the information with what's in the PPM you received</li>
        </ol>
      </div>
    </div>
  );
}