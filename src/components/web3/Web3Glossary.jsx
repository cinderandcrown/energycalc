import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const terms = [
  { term: "Tokenized Royalty Interest", definition: "A fractional ownership stake in oil & gas royalty income, represented as a blockchain token. Holders receive automated distributions proportional to their token holdings when the well produces revenue. Eliminates the need for transfer agents and manual accounting." },
  { term: "Security Token Offering (STO)", definition: "A regulated fundraising method where digital tokens representing ownership in a real asset (e.g., a working interest in a well) are sold to investors. Unlike ICOs, STOs comply with SEC regulations (typically Reg D 506(c) or Reg A+) and offer investor protections." },
  { term: "Smart Contract", definition: "Self-executing code on a blockchain that automatically enforces agreement terms. In energy, smart contracts can automate royalty distributions, JIB (Joint Interest Billing) settlements, and revenue sharing — removing the operator as a single point of control over investor funds." },
  { term: "Decentralized Autonomous Organization (DAO)", definition: "A blockchain-governed entity where token holders vote on operational decisions. Energy DAOs could allow working interest owners to collectively vote on well operations, approve AFEs, and replace operators — rights that are difficult to exercise in traditional JV structures." },
  { term: "On-Chain Production Data", definition: "Well production volumes, pressures, and revenue data recorded immutably on a blockchain. Eliminates the operator's ability to fabricate or manipulate production reports — a common fraud vector in traditional oil & gas deals." },
  { term: "Fractional Working Interest (FWI) Token", definition: "A digital token representing a fractional share of a well's working interest. Enables investors to participate in oil & gas with lower minimums ($1K–$10K vs. traditional $50K–$500K) while maintaining direct ownership of the underlying asset." },
  { term: "Oracle (Blockchain)", definition: "A service that feeds real-world data (commodity prices, production volumes, regulatory filings) to smart contracts on-chain. Critical for automating royalty calculations and ensuring payouts reflect actual market conditions." },
  { term: "Carbon Credit Token", definition: "A blockchain-based representation of verified carbon offset credits. Energy companies can tokenize methane capture, flare reduction, or reforestation credits for transparent trading on decentralized exchanges." },
  { term: "Proof of Reserves", definition: "A cryptographic verification method that proves a tokenized energy asset is backed by real, audited reserves. Similar to a petroleum engineer's reserve report, but verifiable by anyone on-chain without relying on a single auditor." },
  { term: "Liquidity Pool (Energy Assets)", definition: "A decentralized exchange mechanism where tokenized energy interests can be traded without a traditional broker. Solves the #1 problem in oil & gas investing: illiquidity. Investors can sell their position without waiting for the operator to find a buyer." },
];

export default function Web3Glossary() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="space-y-2">
      {terms.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">{item.term}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.definition}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}