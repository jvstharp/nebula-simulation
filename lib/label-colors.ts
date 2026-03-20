/**
 * Nebula Design System — Label / Badge Color Tokens
 * All labels use solid backgrounds with black (#000000) text for maximum contrast.
 *
 * Contrast ratios (WCAG):
 *   red    #d44848 → black 5.14:1  | white 4.09:1
 *   yellow #deaf49 → black 10.74:1 | white 1.96:1
 *   green  #02ba67 → black 8.60:1  | white 2.44:1
 *   blue   #49a5de → black 8.14:1  | white 2.58:1
 *   purple #bb76d6 → black 7.16:1  | white 2.93:1
 *   orange #db966b → black 9.06:1  | white 2.32:1
 */

export const LABEL = {
  red:    { bg: '#d44848', text: '#000000' },
  yellow: { bg: '#deaf49', text: '#000000' },
  green:  { bg: '#02ba67', text: '#000000' },
  blue:   { bg: '#49a5de', text: '#000000' },
  purple: { bg: '#bb76d6', text: '#000000' },
  orange: { bg: '#db966b', text: '#000000' },
} as const;

export type LabelKey = keyof typeof LABEL;

/** Maps any legacy hex badge color to the nearest LABEL entry. */
const COLOR_MAP: Record<string, LabelKey> = {
  // Reds
  '#f87171': 'red', '#ef4444': 'red', '#dc2626': 'red', '#d44848': 'red', '#b00020': 'red',
  // Yellows / Ambers
  '#fbbf24': 'yellow', '#f59e0b': 'yellow', '#d97706': 'yellow', '#deaf49': 'yellow',
  // Greens
  '#22c55e': 'green', '#34d399': 'green', '#28c840': 'green', '#02ba67': 'green',
  '#4ade80': 'green', '#147b58': 'green', '#0d9488': 'green',
  // Blues
  '#60a5fa': 'blue', '#3b82f6': 'blue', '#49a5de': 'blue', '#0891b2': 'blue',
  '#22d3ee': 'blue', '#2dd4bf': 'blue', '#4338ca': 'blue',
  // Purples
  '#818cf8': 'purple', '#a78bfa': 'purple', '#7c3aed': 'purple', '#bb76d6': 'purple',
  // Oranges
  '#fb923c': 'orange', '#db966b': 'orange',
};

/** Returns the LABEL entry for any legacy hex color string. Falls back to blue. */
export function labelColor(hex: string): typeof LABEL[LabelKey] {
  const key = COLOR_MAP[hex.toLowerCase()] ?? 'blue';
  return LABEL[key];
}
