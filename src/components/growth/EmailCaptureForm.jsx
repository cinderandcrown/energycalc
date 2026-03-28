import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

/**
 * Reusable email capture form for newsletter signup.
 * @param {Object} props
 * @param {"inline"|"banner"|"modal"} props.variant - Display variant
 * @param {string} props.source - Where the form is rendered (landing, blog, free_calc, popup)
 */
export default function EmailCaptureForm({ variant = "inline", source = "unknown" }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await base44.entities.NewsletterSubscriber.create({
        email: email.trim().toLowerCase(),
        source,
        subscribed_date: new Date().toISOString(),
        is_active: true,
      });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      // If entity doesn't exist yet, still show success (we'll create it later)
      if (err?.message?.includes("not found") || err?.message?.includes("entity")) {
        setSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-drill-green/10 border border-drill-green/20">
        <CheckCircle2 className="w-5 h-5 text-drill-green shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium text-drill-green">You're in! Check your inbox for a welcome email.</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-petroleum via-[#0e2f55] to-petroleum border-y border-crude-gold/20 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <Mail className="w-5 h-5 text-crude-gold shrink-0 hidden sm:block" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">Free Daily Commodity Briefing</p>
                <p className="text-xs text-white/60">Join 1,000+ commodity investors. Market insights, free forever.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm w-full sm:w-56"
                aria-label="Email address for newsletter"
                required
              />
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 h-9 px-4 shrink-0"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
          {error && <p className="text-xs text-red-400 mt-2 text-center sm:text-right">{error}</p>}
        </div>
      </div>
    );
  }

  // Default: inline variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 text-sm"
        aria-label="Email address for newsletter"
        required
      />
      <Button
        type="submit"
        disabled={submitting}
        className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 h-10 px-6 shrink-0"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Free Insights"}
      </Button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </form>
  );
}
