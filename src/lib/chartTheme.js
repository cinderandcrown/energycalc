/**
 * Theme-aware chart colors using CSS custom properties.
 * These resolve correctly in both light and dark mode.
 *
 * Usage in Recharts: stroke={CHART_COLORS.gold}
 */

// Primary semantic colors — resolve to current theme
export const CHART_COLORS = {
  gold:       "hsl(var(--crude-gold))",        // crude gold accent
  green:      "hsl(var(--drill-green))",        // positive / profit
  red:        "hsl(var(--flare-red))",          // negative / loss
  petroleum:  "hsl(var(--primary))",            // primary brand
  muted:      "hsl(var(--muted-foreground))",   // neutral / reference lines
  border:     "hsl(var(--border))",             // grid / axis
  card:       "hsl(var(--card))",               // tooltip bg
  foreground: "hsl(var(--foreground))",         // text
  blue:       "hsl(220, 80%, 55%)",             // informational blue
  purple:     "hsl(270, 60%, 55%)",             // accent purple
  cyan:       "hsl(190, 80%, 45%)",             // accent cyan
  orange:     "hsl(25, 90%, 55%)",              // accent orange
};

// Ordered palette for multi-series charts (bar colors, pie slices, etc.)
export const CHART_PALETTE = [
  CHART_COLORS.gold,
  CHART_COLORS.green,
  CHART_COLORS.petroleum,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.red,
  CHART_COLORS.cyan,
  CHART_COLORS.orange,
];

// Tax bracket specific colors
export const BRACKET_COLORS = [
  CHART_COLORS.gold,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
];

// Standard tooltip style
export const TOOLTIP_STYLE = {
  background: CHART_COLORS.card,
  border: `1px solid ${CHART_COLORS.border}`,
  borderRadius: 8,
  fontSize: 12,
};

// Standard axis tick style
export const AXIS_TICK = {
  fontSize: 10,
  fill: CHART_COLORS.muted,
};