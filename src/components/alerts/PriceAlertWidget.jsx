import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Bell, BellRing, ArrowUp, ArrowDown, X, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PriceAlertWidget() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.PriceAlert.filter({ is_active: true }, "-created_date", 20).then(data => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const triggered = alerts.filter(a => a.is_triggered && !a.dismissed);
  const watching = alerts.filter(a => !a.is_triggered);

  const dismiss = async (id) => {
    await base44.entities.PriceAlert.update(id, { dismissed: true });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  if (loading || alerts.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
        {triggered.length > 0 ? (
          <BellRing className="w-4 h-4 text-crude-gold" />
        ) : (
          <Bell className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-xs font-medium text-foreground">Price Alerts</span>
        {triggered.length > 0 && (
          <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-[10px] font-bold ml-1">
            {triggered.length} triggered
          </Badge>
        )}
        <Link to="/settings" className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
          Manage <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {/* Triggered alerts — highlighted */}
        {triggered.map(alert => (
          <div key={alert.id} className="flex items-center gap-3 px-4 py-3 bg-crude-gold/5">
            <div className="w-7 h-7 rounded-lg bg-crude-gold/20 flex items-center justify-center shrink-0">
              {alert.direction === "above" ? (
                <ArrowUp className="w-3.5 h-3.5 text-crude-gold" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-crude-gold" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {alert.commodity} hit <span className="font-mono">${alert.triggered_price?.toFixed(2)}</span>
              </p>
              <p className="text-[10px] text-crude-gold">
                Your {alert.direction === "above" ? "↑" : "↓"} ${alert.threshold.toFixed(2)} alert
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => dismiss(alert.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* Active watching — compact */}
        {watching.length > 0 && (
          <div className="px-4 py-2.5">
            <p className="text-[10px] text-muted-foreground mb-1.5">Watching</p>
            <div className="flex flex-wrap gap-1.5">
              {watching.slice(0, 6).map(alert => (
                <Badge
                  key={alert.id}
                  variant="outline"
                  className="text-[10px] font-medium gap-1 py-0.5"
                >
                  {alert.direction === "above" ? (
                    <ArrowUp className="w-2.5 h-2.5 text-drill-green" />
                  ) : (
                    <ArrowDown className="w-2.5 h-2.5 text-flare-red" />
                  )}
                  {alert.commodity} ${alert.threshold}
                </Badge>
              ))}
              {watching.length > 6 && (
                <Badge variant="outline" className="text-[10px]">+{watching.length - 6} more</Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}