import { CheckCircle2, XCircle, AlertTriangle, Clock, Droplets, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  producing: { icon: Droplets, color: "text-drill-green", bg: "bg-drill-green/10", label: "Producing" },
  completed: { icon: CheckCircle2, color: "text-drill-green", bg: "bg-drill-green/10", label: "Completed" },
  abandoned: { icon: XCircle, color: "text-flare-red", bg: "bg-flare-red/10", label: "Abandoned" },
  drilling: { icon: Clock, color: "text-crude-gold", bg: "bg-crude-gold/10", label: "Drilling" },
  disputed: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Disputed" },
  unknown: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted", label: "Unknown" },
};

export default function OperatorProjectHistory({ projects }) {
  if (!projects?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        Known Projects & Track Record ({projects.length})
      </h3>
      <div className="space-y-2">
        {projects.map((p, i) => {
          const st = statusConfig[p.status] || statusConfig.unknown;
          const Icon = st.icon;
          return (
            <div key={i} className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-foreground leading-snug">{p.name}</p>
                <Badge className={`${st.bg} ${st.color} border-0 text-[10px] font-bold shrink-0`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {st.label}
                </Badge>
              </div>
              {p.location && (
                <p className="text-[11px] text-muted-foreground mb-1">{p.location}</p>
              )}
              <p className="text-[11px] text-muted-foreground leading-relaxed">{p.details}</p>
              {p.outcome && (
                <p className="text-[11px] mt-1">
                  <strong className="text-foreground">Outcome:</strong>{" "}
                  <span className="text-muted-foreground">{p.outcome}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}