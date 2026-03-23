import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogNav() {
  const [open, setOpen] = useState(false);

  const handleSignIn = () => {
    if (window.self !== window.top) {
      alert("Sign in is only available from the published app.");
      return;
    }
    base44.auth.redirectToLogin("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png"
            alt="Commodity Investor+"
            className="w-8 h-8 rounded-xl object-contain"
          />
          <div className="leading-none">
            <span className="font-bold text-sm tracking-tight">
              <span className="text-primary dark:text-accent">Commodity</span>
              <span className="text-foreground"> Investor</span><span className="text-crude-gold">+</span>
            </span>
            <span className="hidden sm:block text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
              Blog
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/blog" className="text-sm text-foreground font-medium">Blog</Link>
          <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Legal</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSignIn} className="hidden sm:inline-flex text-sm">
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5"
            asChild
          >
            <Link to="/">
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
          <button onClick={() => setOpen(!open)} className="md:hidden ml-1 p-1.5 text-muted-foreground">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm text-foreground" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/blog" className="block text-sm text-foreground font-medium" onClick={() => setOpen(false)}>Blog</Link>
          <Link to="/legal" className="block text-sm text-foreground" onClick={() => setOpen(false)}>Legal</Link>
          <button onClick={handleSignIn} className="block text-sm text-crude-gold font-semibold">Sign In →</button>
        </div>
      )}
    </header>
  );
}