import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MobileSelect from "@/components/mobile/MobileSelect";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

const COMMODITIES = [
  { value: "WTI Crude", unit: "/bbl" },
  { value: "Brent Crude", unit: "/bbl" },
  { value: "Natural Gas", unit: "/MMBtu" },
  { value: "Heating Oil", unit: "/gal" },
  { value: "Gold", unit: "/oz" },
  { value: "Silver", unit: "/oz" },
  { value: "Copper", unit: "/lb" },
  { value: "Platinum", unit: "/oz" },
];

export default function PriceAlertManager() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [commodity, setCommodity] = useState("WTI Crude");
  const [direction, setDirection] = useState("above");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadAlerts = async () => {
    const data = await base44.entities.PriceAlert.list("-created_date", 50);
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => { loadAlerts(); }, []);

  const createMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.PriceAlert.create({
        commodity,
        direction,
        threshold: Number(threshold),
        is_active: true,
        is_triggered: false,
        dismissed: false,
      });
    },
    onMutate: () => {
      setSaving(true);
      const optimistic = {
        id: `temp-${Date.now()}`,
        commodity,
        direction,
        threshold: Number(threshold),
        is_active: true,
        is_triggered: false,
        dismissed: false,
        created_date: new Date().toISOString(),
      };
      setAlerts(prev => [optimistic, ...prev]);
      setThreshold("");
      setShowForm(false);
    },
    onSuccess: () => {
      toast({ title: "Price alert created!" });
      loadAlerts();
    },
    onSettled: () => setSaving(false),
  });

  const handleCreate = () => {
    if (!threshold || isNaN(Number(threshold))) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      return;
    }
    createMutation.mutate();
  };

  const toggleActive = async (alert) => {
    const newActive = !alert.is_active;
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, is_active: newActive, ...(a.is_triggered && newActive ? { is_triggered: false, triggered_at: null, triggered_price: null, dismissed: false } : {}) } : a));
    await base44.entities.PriceAlert.update(alert.id, {
      is_active: newActive,
      ...(alert.is_triggered && newActive ? { is_triggered: false, triggered_at: null, triggered_price: null, dismissed: false } : {}),
    });
  };

  const deleteAlert = async (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    await base44.entities.PriceAlert.delete(id);
    toast({ title: "Alert deleted" });
  };

  const unit = COMMODITIES.find(c => c.value === commodity)?.unit || "";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Price Alerts</h2>
          {alerts.filter(a => a.is_active && !a.is_triggered).length > 0 && (
            <Badge className="bg-drill-green/10 text-drill-green border-0 text-[10px] font-bold">
              {alerts.filter(a => a.is_active && !a.is_triggered).length} active
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5" />
          New Alert
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-crude-gold/20 bg-muted/30 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Commodity</Label>
              <MobileSelect
                value={commodity}
                onValueChange={setCommodity}
                options={COMMODITIES.map(c => ({ value: c.value, label: c.value }))}
                label="Commodity"
                placeholder="Select commodity"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Direction</Label>
              <MobileSelect
                value={direction}
                onValueChange={setDirection}
                options={[{ value: "above", label: "Goes above" }, { value: "below", label: "Falls below" }]}
                label="Direction"
                placeholder="Select direction"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Price ({unit})</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 75.00"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={saving} className="gap-1.5">
              {saving ? "Creating..." : "Create Alert"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Alerts list */}
      {loading ? (
        <div className="py-6 text-center">
          <div className="w-6 h-6 border-2 border-muted border-t-crude-gold rounded-full animate-spin mx-auto" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-8 text-center">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No price alerts yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">Create one to get notified when a commodity hits your target price.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => {
            const alertUnit = COMMODITIES.find(c => c.value === alert.commodity)?.unit || "";
            return (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  alert.is_triggered
                    ? "border-crude-gold/40 bg-crude-gold/5"
                    : alert.is_active
                    ? "border-border bg-card"
                    : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.is_triggered ? "bg-crude-gold/20" : alert.direction === "above" ? "bg-drill-green/10" : "bg-flare-red/10"
                }`}>
                  {alert.is_triggered ? (
                    <CheckCircle2 className="w-4 h-4 text-crude-gold" />
                  ) : alert.direction === "above" ? (
                    <ArrowUp className="w-4 h-4 text-drill-green" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-flare-red" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {alert.commodity} {alert.direction === "above" ? "above" : "below"}{" "}
                    <span className="font-mono">${alert.threshold.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{alertUnit}</span>
                  </p>
                  {alert.is_triggered ? (
                    <p className="text-xs text-crude-gold font-medium">
                      Triggered at ${alert.triggered_price?.toFixed(2)} · {alert.triggered_at ? new Date(alert.triggered_at).toLocaleString() : ""}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {alert.is_active ? "Monitoring" : "Paused"}
                    </p>
                  )}
                </div>

                <Switch
                  checked={alert.is_active}
                  onCheckedChange={() => toggleActive(alert)}
                  className="shrink-0"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteAlert(alert.id)}
                  aria-label="Delete alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground leading-relaxed pt-2 border-t border-border">
        Alerts are checked every 5 minutes against live commodity prices. Triggered alerts appear on your dashboard.
      </p>
    </div>
  );
}