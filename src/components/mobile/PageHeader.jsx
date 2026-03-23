/**
 * iOS-consistent page header with platform typography.
 * The global back button is now in NavigationHeader via the stack manager,
 * so this component focuses on the page title area only — no duplicate back button.
 */
export default function PageHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <h1 className="text-[17px] sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2 leading-snug">
          {Icon && <Icon className="w-5 h-5 text-primary dark:text-accent shrink-0" />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}