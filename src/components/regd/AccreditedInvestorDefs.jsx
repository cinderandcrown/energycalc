import { CheckCircle2, AlertTriangle, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    title: "Income Test (Individual)",
    badge: "Most Common",
    criteria: "Annual income exceeding $200,000 (or $300,000 jointly with spouse/spousal equivalent) in each of the two most recent years, with a reasonable expectation of the same in the current year.",
    notes: "Income means adjusted gross income. One-time events (selling a house, inheritance) may inflate a single year but won't qualify you if it's not sustained. The $300K joint threshold requires consistent joint income — you can't add one spouse's $150K and call it qualified.",
  },
  {
    title: "Net Worth Test (Individual)",
    badge: "Common",
    criteria: "Individual net worth (or joint with spouse) exceeding $1,000,000, EXCLUDING the value of the primary residence.",
    notes: "Your house equity does NOT count. Mortgage debt on your primary residence also doesn't count against you (unless it exceeds the home's value — then the excess is a liability). 401(k)s, IRAs, brokerage accounts, real estate equity (non-primary), and business ownership DO count. Student loans, car loans, and credit card debt count against you.",
  },
  {
    title: "Professional Certifications",
    badge: "Since 2020",
    criteria: "Holders of certain SEC-designated professional certifications, designations, or credentials: Series 7, Series 65, or Series 82 licenses in good standing.",
    notes: "Added by the SEC in August 2020 under amended Rule 501(a). This recognizes that financial professionals have the sophistication to evaluate private offerings regardless of their personal wealth. The SEC may designate additional certifications in the future.",
  },
  {
    title: "Knowledgeable Employees",
    badge: "Fund Context",
    criteria: "'Knowledgeable employees' of a private fund (as defined in Rule 3c-5(a)(4) under the Investment Company Act) with respect to investments of that fund.",
    notes: "This applies to employees of private fund managers who are involved in the investment activities of the fund. It does not apply to general employees of any company.",
  },
  {
    title: "Entities — Institutions",
    badge: "Entity",
    criteria: "Banks, insurance companies, registered investment companies, business development companies, small business investment companies, or employee benefit plans with assets exceeding $5 million.",
    notes: "Institutional investors are presumed sophisticated. If you're investing through a family office, it must have at least $5M in assets under management and the investment must be directed by someone capable of evaluating the merits and risks.",
  },
  {
    title: "Entities — LLCs, Trusts, Corporations",
    badge: "Entity",
    criteria: "Any entity with total assets exceeding $5 million that was not formed for the specific purpose of acquiring the securities being offered. Also: any entity in which ALL equity owners are individually accredited.",
    notes: "The 'not formed for the specific purpose' language is critical. If someone creates an LLC specifically to pool money from non-accredited investors to meet the $5M threshold, this is illegal structuring and a major red flag.",
  },
  {
    title: "Family Offices",
    badge: "Since 2020",
    criteria: "Family offices with at least $5 million in assets under management and their 'family clients' (as defined under the Investment Advisers Act), provided the investment is directed by a person capable of evaluating the merits and risks.",
    notes: "Added in 2020. This codified the common practice of wealthy families using family offices to make private investments.",
  },
  {
    title: "Spousal Equivalents",
    badge: "Since 2020",
    criteria: "The SEC now allows 'spousal equivalents' (cohabitants with a relationship generally equivalent to a spouse) to pool finances for the income and net worth tests.",
    notes: "This was a significant 2020 update. Previously, only legally married couples could combine income/assets. Now domestic partners and long-term cohabitants can qualify jointly.",
  },
];

export default function AccreditedInvestorDefs() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 dark:border-accent/30 pl-3">
        Under SEC Rule 501(a), an <strong className="text-foreground">"accredited investor"</strong> is a person or entity that meets specific financial thresholds or professional qualifications. 
        Most oil & gas private placements require investors to be accredited. The definition was last updated in <strong className="text-foreground">August 2020</strong> to add professional certifications and family offices.
      </p>

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.title} className="rounded-lg border border-border/50 bg-card p-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-bold text-foreground">{c.title}</p>
              <Badge variant="outline" className="text-[10px]">{c.badge}</Badge>
            </div>
            <div className="rounded-lg bg-drill-green/5 border border-drill-green/20 p-2.5">
              <p className="text-xs text-foreground leading-relaxed font-medium">{c.criteria}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.notes}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-crude-gold/5 border border-crude-gold/20 p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-crude-gold shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Self-Certification vs. Verification:</strong> Under Rule 506(b), issuers can accept an investor's self-certification (a signed questionnaire) that they are accredited. Under Rule 506(c), the issuer MUST take "reasonable steps" to verify — meaning they need to see your tax returns, bank statements, or a third-party letter. If a 506(c) offering doesn't ask for verification, the offering is non-compliant.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Lying About Accredited Status:</strong> Falsely claiming to be accredited to invest in a private placement is securities fraud. Don't do it. Beyond the legal risk, investing in illiquid securities you can't afford to lose is financially dangerous.
          </p>
        </div>
      </div>
    </div>
  );
}