import { motion } from "framer-motion";

const GRADES = {
  A: { label: "Highly Trusted", color: "#2E7D32", bg: "bg-drill-green/10", border: "border-drill-green/30", text: "text-drill-green" },
  B: { label: "Generally Reliable", color: "#4CAF50", bg: "bg-drill-green/5", border: "border-drill-green/20", text: "text-drill-green" },
  C: { label: "Proceed With Caution", color: "#D4A843", bg: "bg-crude-gold/10", border: "border-crude-gold/30", text: "text-crude-gold" },
  D: { label: "Significant Concerns", color: "#FF9800", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500" },
  F: { label: "Do Not Invest", color: "#C62828", bg: "bg-flare-red/10", border: "border-flare-red/30", text: "text-flare-red" },
};

export default function TrustScoreGauge({ score, grade, operatorName }) {
  const gradeInfo = GRADES[grade] || GRADES.C;
  const clampedScore = Math.max(0, Math.min(100, score));
  // Arc from 180° (left) to 0° (right) — semi-circle
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - (startAngle - endAngle) * (clampedScore / 100);
  const cx = 100, cy = 90, r = 70;
  const needleX = cx + r * Math.cos(sweepAngle);
  const needleY = cy - r * Math.sin(sweepAngle);

  return (
    <div className={`rounded-xl border ${gradeInfo.border} ${gradeInfo.bg} p-5`}>
      <div className="flex flex-col items-center">
        {/* Gauge SVG */}
        <svg viewBox="0 0 200 110" className="w-48 sm:w-56 mb-2">
          {/* Background arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored segments */}
          <path d="M 20 90 A 70 70 0 0 1 52 37" fill="none" stroke="#C62828" strokeWidth="12" strokeLinecap="round" />
          <path d="M 52 37 A 70 70 0 0 1 100 20" fill="none" stroke="#FF9800" strokeWidth="12" strokeLinecap="round" />
          <path d="M 100 20 A 70 70 0 0 1 148 37" fill="none" stroke="#D4A843" strokeWidth="12" strokeLinecap="round" />
          <path d="M 148 37 A 70 70 0 0 1 180 90" fill="none" stroke="#2E7D32" strokeWidth="12" strokeLinecap="round" />
          {/* Needle */}
          <motion.line
            x1={cx}
            y1={cy}
            initial={{ x2: 30, y2: 90 }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            stroke={gradeInfo.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="5" fill={gradeInfo.color} />
          {/* Score label */}
          <text x={cx} y={cy + 2} textAnchor="middle" className="text-[11px] fill-current text-muted-foreground font-mono" dy="18">
            {clampedScore}/100
          </text>
        </svg>

        {/* Grade badge */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className={`text-4xl font-extrabold font-mono ${gradeInfo.text}`}>{grade}</span>
          <div>
            <p className={`text-sm font-bold ${gradeInfo.text}`}>{gradeInfo.label}</p>
            <p className="text-[11px] text-muted-foreground">Trust Score for {operatorName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}