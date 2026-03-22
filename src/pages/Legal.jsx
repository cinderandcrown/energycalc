import { useState } from "react";
import { Shield, Lock, FileText, Scale, Eye, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const LAST_UPDATED = "March 22, 2026";

const sections = [
  {
    id: "not-a-broker",
    icon: Scale,
    title: "Not a Broker-Dealer or Investment Advisor",
    content: `EnergyCalc Pro is not a registered broker-dealer, investment advisor, investment company, or financial planner. We are not registered with the Financial Industry Regulatory Authority (FINRA), the Securities and Exchange Commission (SEC), or any state securities regulator.

Nothing on this platform constitutes a solicitation, offer, recommendation, or advice to buy or sell any security, commodity, or investment product. EnergyCalc Pro does not endorse, recommend, or facilitate any specific oil and gas investment, operator, offering, or transaction.

All calculations, projections, and outputs produced by this platform are mathematical estimates based solely on the inputs you provide. They do not represent actual investment results, guaranteed returns, or predictions of future performance.

Users who require investment advice should consult a registered investment advisor (RIA), licensed broker-dealer, or qualified financial professional who is legally authorized to provide investment recommendations.`
  },
  {
    id: "educational-only",
    icon: FileText,
    title: "Educational & Informational Purpose Only",
    content: `EnergyCalc Pro is an educational and financial modeling tool designed to help users understand the general economic characteristics of oil and gas investments, including tax treatment of working interest investments, illustrative production revenue projections, general market data and commodity pricing trends, and common investor protection concepts.

All information on this platform — including but not limited to tax benefit calculations, rate of return estimates, IRR projections, market data, and investor education content — is provided for informational and educational purposes only and does not constitute tax advice, legal advice, investment advice, or accounting advice.

Oil and gas investments are inherently speculative and involve substantial risk, including the risk of total loss of capital. Past performance of any investment does not guarantee future results.

The AI-powered PPM Analyzer on the Investor Protection page analyzes text using artificial intelligence. Its output does not constitute legal analysis, securities law advice, or a legal opinion. No attorney-client relationship is created by use of this tool. Always retain a licensed securities attorney to review any investment offering document before committing capital.`
  },
  {
    id: "no-guarantee",
    icon: Shield,
    title: "No Guarantee of Accuracy or Completeness",
    content: `EnergyCalc Pro makes no representations or warranties, express or implied, regarding the accuracy, completeness, reliability, suitability, or availability of any information, tools, or calculations provided on this platform. All figures are illustrative only.

Production estimates and decline curves presented in this platform are generalized models based on industry-standard decline curve analysis. Actual well performance will vary materially based on geology, completion design, reservoir pressure, commodity prices, and operator efficiency. Users should not rely on these estimates when making investment decisions.

Commodity price data displayed on the Markets page is sourced from third-party data providers and AI-generated research. This data may be delayed, estimated, or approximate. EnergyCalc Pro does not guarantee the timeliness or accuracy of market data. For trading or investment decisions, always consult a licensed commodity broker or use official exchange data sources.

Tax benefit calculations are based on current federal tax law as of the platform's last update. Tax laws change frequently. Consult a licensed CPA or tax attorney familiar with oil and gas taxation before relying on any tax-related output from this platform.`
  },
  {
    id: "regulatory",
    icon: Scale,
    title: "Regulatory Compliance Notice",
    content: `FINRA Rule 2210 Compliance: EnergyCalc Pro's investor education content is designed to be fair, balanced, and not misleading. We do not make performance guarantees, project specific returns without clear hypothetical disclaimers, or omit material risks associated with oil and gas investments.

SEC Regulation: EnergyCalc Pro does not participate in the offer, sale, or solicitation of any securities. The Investor Protection Center on this platform is purely educational content designed to help investors identify red flags in private placement memoranda. We do not evaluate specific securities offerings and our AI analyzer does not constitute a securities analysis or investment recommendation.

Investment Adviser Act of 1940: EnergyCalc Pro does not provide personalized investment advice and is not required to register as an investment advisor under the Investment Advisers Act of 1940. Our tools provide generalized financial models based on user-entered data.

State Securities Laws (Blue Sky Laws): This platform does not offer, sell, or facilitate the purchase of any securities in any state. Content on this platform does not constitute a securities offering under any state's Blue Sky laws.

Commodity Exchange Act: EnergyCalc Pro does not provide commodity trading advice, managed futures recommendations, or act as a commodity trading advisor (CTA) or commodity pool operator (CPO) as defined by the CFTC.`
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Policy",
    content: `Effective Date: ${LAST_UPDATED}

INFORMATION WE COLLECT
EnergyCalc Pro collects information you provide directly: account registration data (name, email address), calculation inputs you choose to save, and user preferences (theme settings).

We do not collect Social Security numbers, financial account numbers, investment portfolio information, or any data you enter into the calculators unless you explicitly choose to save a calculation to your account.

HOW WE USE YOUR INFORMATION
We use your information to provide the EnergyCalc Pro platform and its features, maintain your saved calculations and scenarios, send service-related communications (account notices, updates), and improve the platform's functionality and user experience.

We do not sell, rent, or trade your personal information to third parties for marketing purposes.

DATA SECURITY
We implement industry-standard security measures to protect your information. However, no internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security of your data.

YOUR RIGHTS
You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@energycalcpro.com. We will respond to verifiable requests within 30 days.

COOKIES & ANALYTICS
We use cookies and similar technologies to maintain your session, remember your preferences (such as dark/light mode), and analyze platform usage in aggregate. We do not use advertising cookies or sell behavioral data.

CHILDREN'S PRIVACY
EnergyCalc Pro is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it promptly.

CALIFORNIA RESIDENTS (CCPA)
California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to delete personal information, and the right to opt out of sale (we do not sell personal information). To exercise your CCPA rights, contact privacy@energycalcpro.com.

CHANGES TO THIS POLICY
We may update this privacy policy from time to time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.`
  },
  {
    id: "terms",
    icon: FileText,
    title: "Terms of Use",
    content: `By accessing and using EnergyCalc Pro, you agree to the following terms:

PERMITTED USE: EnergyCalc Pro is provided for your personal, non-commercial educational use. You may not use this platform to solicit investors, market securities offerings, provide investment advice to third parties for compensation, or misrepresent the source or nature of financial calculations to any person.

PROHIBITED USE: You agree not to use EnergyCalc Pro to prepare, distribute, or represent that AI-generated PPM analysis constitutes legal review or a securities law opinion; to make investment decisions without independently verifying all inputs and consulting licensed professionals; or to reproduce or distribute platform content in a manner that implies it constitutes registered investment advice.

LIMITATION OF LIABILITY: To the maximum extent permitted by applicable law, EnergyCalc Pro and its owners, operators, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of this platform, including reliance on any calculation, projection, market data, or educational content.

INDEMNIFICATION: You agree to indemnify and hold harmless EnergyCalc Pro from any claims, losses, or damages arising from your misuse of the platform or violation of these terms.

GOVERNING LAW: These terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration under JAMS rules.

CONTACT: For legal notices: legal@energycalcpro.com`
  },
];

function Section({ section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary dark:text-accent" />
        </div>
        <p className="flex-1 text-sm font-semibold text-foreground">{section.title}</p>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
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
            <div className="px-5 py-4 space-y-3">
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} className={`text-xs leading-relaxed ${para.toUpperCase() === para && para.length < 80 ? "font-semibold text-foreground uppercase tracking-wide mt-4 first:mt-0" : "text-muted-foreground"}`}>
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Legal() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary dark:text-accent" />
          <h1 className="text-xl font-bold text-foreground">Legal & Privacy</h1>
        </div>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Master Disclaimer Box */}
      <div className="rounded-2xl border-2 border-primary/30 dark:border-accent/30 bg-primary/5 dark:bg-accent/5 p-5">
        <p className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest mb-2">Important Legal Notice</p>
        <p className="text-sm text-foreground leading-relaxed font-medium">
          EnergyCalc Pro is a financial education and modeling platform. It is <strong>not</strong> a registered broker-dealer, investment advisor, or financial planner. Nothing on this platform constitutes investment advice, a securities offering, or a solicitation to invest. All calculations are illustrative estimates only. Oil and gas investments involve substantial risk, including risk of total loss. Always consult licensed professionals before investing.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Not SEC Registered", "Not FINRA Member", "Not an Investment Advisor", "Educational Use Only"].map(tag => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-2">
        {sections.map(section => (
          <Section key={section.id} section={section} />
        ))}
      </div>

      {/* Regulatory Links */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Regulatory Resources</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "SEC.gov — Investor Education", url: "https://www.sec.gov/investor" },
            { name: "FINRA — Investor Education Foundation", url: "https://www.finrafoundation.org/" },
            { name: "FINRA BrokerCheck", url: "https://brokercheck.finra.org/" },
            { name: "NASAA — State Securities Regulators", url: "https://www.nasaa.org/" },
            { name: "CFTC — Commodity Fraud Advisories", url: "https://www.cftc.gov/LearnAndProtect/index.htm" },
            { name: "SEC EDGAR — Company Filings", url: "https://www.sec.gov/cgi-bin/browse-edgar" },
          ].map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary dark:text-accent hover:underline p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Questions about these terms or your privacy? Contact us at{" "}
          <a href="mailto:legal@energycalcpro.com" className="text-primary dark:text-accent hover:underline font-medium">legal@energycalcpro.com</a>
          {" "}· Privacy requests:{" "}
          <a href="mailto:privacy@energycalcpro.com" className="text-primary dark:text-accent hover:underline font-medium">privacy@energycalcpro.com</a>
        </p>
      </div>

      {/* Bottom nav link */}
      <div className="text-center">
        <Link to="/investor-protection" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
          → Visit the Investor Protection Center for PPM red flags &amp; due diligence tools
        </Link>
      </div>
    </div>
  );
}