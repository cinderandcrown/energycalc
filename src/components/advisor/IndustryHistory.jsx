import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Skull, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const timeline = [
  {
    era: "1860s–1920s: The Wild West",
    summary: "No regulation. No disclosure. Just money and violence.",
    events: [
      {
        year: "1865",
        title: "Pithole City, Pennsylvania",
        detail: "America's first oil boom town. Population surged from 0 to 20,000 in months on speculative oil claims. Most 'investors' bought shares in wells that didn't exist. By 1868, Pithole was a ghost town. Population: 237. This pattern — boom, speculation, bust, disappearance — would repeat for 160 years."
      },
      {
        year: "1870s",
        title: "Standard Oil & the Monopoly Model",
        detail: "John D. Rockefeller didn't commit fraud in the traditional sense — he committed something worse: total market control. Standard Oil controlled 90% of U.S. refining by 1880 through predatory pricing, secret railroad rebates, and buying out or crushing competitors. Independent producers had no market access. The lesson: even 'legitimate' oil money concentrates power in ways that crush small investors."
      },
      {
        year: "1901",
        title: "Spindletop & the Birth of Stock Fraud",
        detail: "The Spindletop gusher in Beaumont, TX, produced 100,000 bbl/day. Within months, over 500 'oil companies' were incorporated in Texas — most existed only on paper. Shares were sold door-to-door and by mail. The term 'wildcat' entered the vocabulary. Thousands of Americans lost their savings to companies that never drilled a single well."
      },
      {
        year: "1910s",
        title: "The Lease Hound Era",
        detail: "'Lease hounds' roamed the Southwest, buying mineral leases from uneducated landowners for pennies, then flipping them to eastern investors at 1000x markups. Many leases were on land with no geological prospects whatsoever. There was no licensing requirement and no accountability."
      },
    ]
  },
  {
    era: "1920s–1960s: Regulation Arrives (Sort Of)",
    summary: "Securities laws created, but oil & gas carved out special exemptions.",
    events: [
      {
        year: "1920s",
        title: "Blue Sky Laws & the Texas Exemption",
        detail: "States began passing 'Blue Sky Laws' to stop fraudulent securities sales. But the oil & gas lobby ensured that working interest sales were often EXEMPT from registration — a carve-out that persists today. Texas, Oklahoma, and Louisiana explicitly exempted most oil & gas offerings from state securities oversight."
      },
      {
        year: "1933–34",
        title: "SEC Created — But Oil Gets Special Treatment",
        detail: "The Securities Act of 1933 and Securities Exchange Act of 1934 created the SEC and required securities registration. However, Regulation D exemptions (later codified) allowed 'private placements' to skip registration entirely — and oil & gas became the #1 user of these exemptions. The industry successfully argued that drilling is 'too speculative' for public offerings, creating a permanent regulatory gap."
      },
      {
        year: "1940s–50s",
        title: "The Depletion Allowance Golden Age",
        detail: "Congress gave oil producers a 27.5% depletion allowance — meaning 27.5% of gross income was completely tax-free. This made oil investments irresistible for wealthy Americans and created a class of 'tax shelter investors' who cared more about deductions than production. Operators learned they could make money by SELLING DEALS, not by producing oil. This perverse incentive still drives much of the industry today."
      },
      {
        year: "1950s–60s",
        title: "The 'Dry Hole Fund' Era",
        detail: "Promoters created 'drilling funds' that pooled investor money. The tax code allowed investors to deduct 100% of 'intangible drilling costs' (labor, fuel, chemicals) in the year incurred — even if the well was dry. Promoters realized they could drill cheap, marginal wells, collect fees, and investors would still come back for the tax write-off. The economic incentive to actually find oil was secondary to the tax incentive to drill anything."
      },
    ]
  },
  {
    era: "1970s–1980s: Tax Shelter Mania & Collapse",
    summary: "The golden age of oil & gas fraud. Billions lost. Careers destroyed.",
    events: [
      {
        year: "1973–79",
        title: "OPEC Embargo & the Drilling Boom",
        detail: "Arab oil embargoes sent crude from $3 to $35/bbl. Every dentist, doctor, and lawyer in America suddenly wanted to invest in oil wells. Operators couldn't sell deals fast enough. Legitimate and fraudulent offerings exploded simultaneously. The IRS was effectively subsidizing speculation through IDC deductions."
      },
      {
        year: "1980–85",
        title: "Peak Tax Shelter Fraud",
        detail: "At its peak, oil & gas limited partnerships were raising $5–10 BILLION per year from retail investors. Operators like Parker & Parsley, Pioneer, and Hunt Oil built legitimate empires — but for every real operator, there were 50 'promoters' selling LP units in nonexistent wells, dry holes dressed up as producers, and Ponzi schemes funded by new investor money. The SEC was overwhelmed. State regulators were underfunded. The IRS processed the deductions without questioning the underlying investments."
      },
      {
        year: "1986",
        title: "Tax Reform Act — The Music Stops",
        detail: "The Tax Reform Act of 1986 eliminated most passive loss deductions for oil & gas LPs. Overnight, the primary reason most investors were in these deals — tax write-offs — disappeared. LP values collapsed. Investors who paid $100,000 per unit found their interests worth $5,000 or less. The legitimate operators survived; the fraudulent ones vanished with investor capital. An estimated $50–100 BILLION in investor wealth was destroyed across the 1980s oil & gas LP collapse."
      },
      {
        year: "1986–90",
        title: "The Litigation Tsunami",
        detail: "Burned investors sued everyone — operators, accountants, lawyers, brokers, and banks. Major brokerage firms like Prudential-Bache paid $1.5 BILLION in settlements for selling unsuitable oil & gas LPs to retail investors. Dean Witter, Kidder Peabody, and Smith Barney paid hundreds of millions more. The era proved that Wall Street and Main Street operators were equally capable of selling garbage to trusting investors."
      },
    ]
  },
  {
    era: "1990s–2010s: The Same Game, Smaller Scale",
    summary: "Big firms left. Small operators filled the gap. Fraud went private.",
    events: [
      {
        year: "1990s",
        title: "The 'Boiler Room' Era",
        detail: "With major brokerages out of the oil & gas game, small 'boiler room' operations filled the void. Cold-calling firms in Texas, Oklahoma, and Colorado sold unregistered working interests to unsuspecting investors over the phone. The pitches were sophisticated: geological maps, production projections, and 'limited time' offers. Most wells were marginal at best; many were pure fiction. NASAA (North American Securities Administrators Association) ranked oil & gas as the #1 source of investment fraud complaints for multiple years."
      },
      {
        year: "2000s",
        title: "The Internet Amplifies Everything",
        detail: "Online marketing let operators reach millions of potential investors. Slick websites with stock photos of drilling rigs, testimonial videos, and 'proprietary geological technology' claims became the new boiler room. Sites like oilcashflow.com and similar platforms sold JV working interests at massive markups. The SEC's enforcement resources couldn't keep pace with the volume."
      },
      {
        year: "2008–14",
        title: "Shale Boom & the Fracking Gold Rush",
        detail: "Hydraulic fracturing unlocked massive reserves in the Bakken, Permian, and Eagle Ford. Legitimate companies created real wealth. But the shale boom also attracted a new wave of promoters selling working interests in 'proven shale plays' to retail investors at inflated prices. The underlying geology was often real — but the economics were structured so investors bore all risk while operators collected guaranteed fees."
      },
      {
        year: "2015–20",
        title: "The Commodity Crash & Another Wave of Losses",
        detail: "Oil crashed from $100+ to $26/bbl in 2015–16. Thousands of wells became uneconomic. Investors in LP programs and JV deals watched their revenue checks shrink to nothing while operating costs continued. Many operators used the downturn as an excuse to abandon wells, plug them at investor expense, or simply stop communicating. The cycle repeated: investors lost, operators moved on to the next deal."
      },
    ]
  },
  {
    era: "2020s: Same Playbook, New Packaging",
    summary: "Social media, AI-generated pitches, and 'energy transition' buzzwords.",
    events: [
      {
        year: "2020–23",
        title: "COVID & the ESG Distraction",
        detail: "Oil went briefly negative in April 2020. Then rebounded to $120+ by 2022. Operators who survived started raising capital again, now with 'ESG compliance' and 'responsible energy' marketing — often meaningless labels. Some operators began using AI to generate investor presentations, geological reports, and marketing materials — making due diligence even harder."
      },
      {
        year: "2023–Present",
        title: "Social Media & 'Energy Influencers'",
        detail: "TikTok, YouTube, and Instagram creators now promote oil & gas deals to their followers — often without disclosing compensation. 'Passive income from oil wells' videos generate millions of views. The deals promoted are typically high-markup JVs or LP programs where the influencer receives a referral fee of 5–15% of invested capital. The SEC has begun enforcement actions, but social media moves faster than regulation."
      },
      {
        year: "Current",
        title: "The Regulatory Gap Persists",
        detail: "In 2024–2026, oil & gas remains the LEAST regulated alternative investment in America. Reg D 506(b) allows operators to raise unlimited capital from accredited investors with NO SEC review of the offering. Form D filings are often incomplete or never filed. State regulators lack resources. The accredited investor standard ($200K income / $1M net worth) was set in 1982 and never adjusted for inflation — meaning it captures far more 'ordinary' investors today than originally intended."
      },
    ]
  },
];

export default function IndustryHistory() {
  const [openEra, setOpenEra] = useState(null);

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border-2 border-flare-red/30 bg-flare-red/5">
        <div className="flex items-start gap-2">
          <Skull className="w-4 h-4 text-flare-red mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">This history is not exaggerated.</strong> Every event below is documented in SEC enforcement actions, congressional records, court filings, or journalism. The oil & gas industry has created genuine wealth for millions — but it has also been the single largest source of investment fraud in American history. You deserve to know both sides before putting your money in.
          </p>
        </div>
      </div>

      {timeline.map((era) => (
        <div key={era.era} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setOpenEra(openEra === era.era ? null : era.era)}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
          >
            <Calendar className="w-4 h-4 text-crude-gold shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{era.era}</p>
              <p className="text-xs text-muted-foreground">{era.summary}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openEra === era.era ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {openEra === era.era && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {era.events.map((ev) => (
                    <div key={ev.year + ev.title} className="relative pl-6 pb-3 border-l-2 border-crude-gold/30 last:pb-0">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-crude-gold border-2 border-card" />
                      <Badge variant="outline" className="text-[10px] font-mono mb-1">{ev.year}</Badge>
                      <p className="text-sm font-semibold text-foreground mb-1">{ev.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ev.detail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}