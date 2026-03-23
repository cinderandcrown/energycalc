import { Heart, BookOpen, Sparkles } from "lucide-react";

export default function StewardshipBanner() {
  return (
    <div className="rounded-2xl border border-crude-gold/30 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-crude-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-crude-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-crude-gold/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-crude-gold" />
          </div>
          <h2 className="text-white font-bold text-lg">Why Financial Literacy Matters</h2>
        </div>

        <div className="space-y-3">
          <p className="text-white/90 text-sm leading-relaxed">
            Throughout history, the stewardship of resources has been recognized as a fundamental responsibility — not an optional pursuit. 
            From the ancient parable of the talents to modern portfolio theory, the principle remains the same: <strong className="text-crude-gold">what we're entrusted with, we're expected to manage wisely.</strong>
          </p>

          <p className="text-white/80 text-sm leading-relaxed">
            Too often, investing is seen as something only for the wealthy or the risk-tolerant. But understanding how markets work, 
            how commodities are priced, and how economic forces move is a form of self-empowerment. <strong className="text-crude-gold">Knowledge doesn't tell you what to do — it gives you the ability to decide for yourself.</strong>
          </p>

          <p className="text-white/80 text-sm leading-relaxed">
            This section exists to help you understand the mechanics — not to push you toward any decision, but to ensure that 
            whatever decisions you make, you make them with clarity and confidence. Good stewardship starts with understanding.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {[
            { icon: BookOpen, text: "Learn economic principles" },
            { icon: Sparkles, text: "See cause & effect in real time" },
            { icon: Heart, text: "Steward your resources wisely" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-white/70">
              <Icon className="w-3.5 h-3.5 text-crude-gold" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}