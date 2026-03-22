import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Moon, Sun, Shield, LogOut, ChevronRight, Zap, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setFullName(u?.full_name || "");
      setCompany(u?.company || "");
    });
    const isDark = localStorage.getItem("energycalc-theme") !== "light";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = (val) => {
    setDarkMode(val);
    localStorage.setItem("energycalc-theme", val ? "dark" : "light");
    document.documentElement.classList.toggle("dark", val);
  };

  const saveProfile = async () => {
    setSaving(true);
    await base44.auth.updateMe({ company });
    toast({ title: "Profile updated!" });
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.auth.deleteAccount();
      toast({ title: "Account deleted", description: "Your account and data have been removed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete account. Please contact support.", variant: "destructive" });
    }
    setDeleting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Subscription */}
      <div className="rounded-2xl border border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-crude-gold" />
              <span className="text-crude-gold text-xs font-semibold uppercase tracking-wide">Current Plan</span>
            </div>
            <h2 className="text-white font-bold text-lg">Free Tier</h2>
            <p className="text-white/60 text-xs mt-1">Up to 3 saved calculations. Upgrade for unlimited access.</p>
          </div>
          <Badge className="bg-crude-gold text-petroleum font-semibold text-xs">FREE</Badge>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="text-white/80 text-xs font-semibold mb-3">Pro features — $9.99/month</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {["Unlimited saved calculations", "Scenario comparison", "PDF export", "Live price feed"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-crude-gold/80 flex items-center justify-center">
                  <span className="text-petroleum text-[8px] font-bold">✓</span>
                </div>
                <span className="text-white/70 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <Button className="w-full bg-crude-gold text-petroleum font-semibold hover:opacity-90">
            Upgrade to Pro
          </Button>
        </div>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <User className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>
        <div>
          <Label>Full Name</Label>
          <Input value={fullName} disabled className="mt-1 bg-muted/50 text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-1">Name cannot be changed here. Contact support.</p>
        </div>
        <div>
          <Label>Email</Label>
          <Input value={user?.email || ""} disabled className="mt-1 bg-muted/50 text-muted-foreground" />
        </div>
        <div>
          <Label>Company (optional)</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company name"
            className="mt-1"
          />
        </div>
        <Button onClick={saveProfile} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border mb-4">
          {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Recommended for field environments</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDark} />
        </div>
      </div>

      {/* Legal */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
        <div className="flex items-center gap-2 pb-2 border-b border-border mb-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Legal & Compliance</h2>
        </div>
        <Link to="/legal" className="w-full flex items-center justify-between py-2 text-sm text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Privacy Policy
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/legal" className="w-full flex items-center justify-between py-2 text-sm text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Terms of Use
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/legal" className="w-full flex items-center justify-between py-2 text-sm text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Full Legal Disclosures
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="pt-3 border-t border-border mt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Not a broker-dealer or investment adviser. Calculations are illustrative only. Oil &amp; gas investments carry substantial risk. Consult a CPA/attorney before investing.
          </p>
        </div>
      </div>

      {/* Logout */}
      <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>

      {/* Delete Account */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-4 h-4 text-destructive" />
          <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Permanently delete your account and all associated data including saved calculations, scenarios, and preferences. This action cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full gap-2" disabled={deleting}>
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your EnergyCalc Pro account and remove all your data including saved calculations, scenarios, and preferences. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Delete My Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}