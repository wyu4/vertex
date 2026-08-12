export function resolveCssColor(color: string, el: HTMLElement) {
  const match = color.trim().match(/^var\((--[^,)]+)/);
  if (!match) return color;
  return getComputedStyle(el).getPropertyValue(match[1]).trim();
}
