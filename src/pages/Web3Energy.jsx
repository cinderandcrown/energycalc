import { Link } from "react-router-dom";
import { Blocks, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import TokenizedAssetsGuide from "../components/web3/TokenizedAssetsGuide";
import BlockchainUseCases from "../components/web3/BlockchainUseCases";
import Web3Glossary from "../components/web3/Web3Glossary";
import Web3Risks from "../components/web3/Web3Risks";
import usePageTitle from "@/hooks/usePageTitle";

export default function Web3Energy() {
  usePageTitle("Web3 & Blockchain in Energy");
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border-2 border-crude-gold/30 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-crude-gold/20 border border-crude-gold/40 flex items-center justify-center">
            <Blocks className="w-5 h-5 text-crude-gold" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
              Web3 & Energy
              <Badge className="bg-crude-gold/20 text-crude-gold border-0 text-[10px] font-bold">EDUCATIONAL</Badge>
            </h1>
            <p className="text-white/60 text-xs">Blockchain, tokenization & the future of energy investing</p>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          The convergence of <strong className="text-crude-gold">blockchain technology</strong> and <strong className="text-white">commodity energy</strong> is creating new investment structures, transparent operations, and democratized access to an asset class historically reserved for insiders. From tokenized working interests to on-chain production tracking, Web3 is addressing the energy sector's oldest problems: opacity, illiquidity, and operator control.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: "$16B+", label: "Tokenized real-world assets (2025 est.)" },
            { val: "Reg D/A+", label: "SEC-compliant token offering frameworks" },
            { val: "T+0", label: "Instant blockchain settlement vs. T+2 traditional" },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="font-mono font-bold text-crude-gold text-sm">{item.val}</p>
              <p className="text-white/50 text-[10px] leading-tight mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tokenization">
        <TabsList className="w-full grid grid-cols-4 h-auto gap-1 p-1">
          <TabsTrigger value="tokenization" className="text-xs py-2">Tokenized Assets</TabsTrigger>
          <TabsTrigger value="usecases" className="text-xs py-2">Blockchain Use Cases</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs py-2">Risks & Warnings</TabsTrigger>
          <TabsTrigger value="glossary" className="text-xs py-2">Web3 Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="tokenization" className="mt-4">
          <TokenizedAssetsGuide />
        </TabsContent>

        <TabsContent value="usecases" className="mt-4">
          <BlockchainUseCases />
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <Web3Risks />
        </TabsContent>

        <TabsContent value="glossary" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              Key terminology at the intersection of blockchain and energy investing. Understanding these terms is critical before evaluating any tokenized energy offering.
            </p>
          </div>
          <Web3Glossary />
        </TabsContent>
      </Tabs>

      {/* Cross-links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/investor-protection" className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
          <p className="text-sm font-semibold text-foreground mb-0.5">Investor Protection Center</p>
          <p className="text-xs text-muted-foreground">The same fraud principles apply — learn how to vet any energy deal, tokenized or traditional.</p>
        </Link>
        <Link to="/learn" className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
          <p className="text-sm font-semibold text-foreground mb-0.5">Energy Investing Fundamentals</p>
          <p className="text-xs text-muted-foreground">Master WI, NRI, IDC, and depletion before exploring tokenized structures.</p>
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="pb-4 pt-2 text-center">
        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
          This Web3 & Energy content is for educational purposes only and does not constitute investment, legal, or tax advice. Tokenized securities are subject to federal and state securities laws. Always consult qualified legal and financial professionals before investing in any digital asset or tokenized energy product.
        </p>
      </div>
    </div>
  );
}