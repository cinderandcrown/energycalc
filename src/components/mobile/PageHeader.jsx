import useRouteDepth from "@/hooks/useRouteDepth";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Mobile-friendly page header with back arrow.
 * Uses the global useRouteDepth hook to determine whether to show the back button.
 */
export default function PageHeader({ title, subtitle, icon: Icon, children }) {
  const navigate = useNavigate();
  const { showBack } = useRouteDepth();

  return (
    <div className="flex items-start gap-3">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mt-1 w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary dark:text-accent shrink-0" />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}