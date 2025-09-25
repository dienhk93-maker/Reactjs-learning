export function hashHue(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  return Math.abs(h) % 360;
}

export function getTagColors(label: string) {
  const hue = hashHue(label);
  const bg = `hsl(${hue} 95% 95%)`;
  const border = `hsl(${hue} 70% 82%)`;
  const text = `hsl(${hue} 40% 28%)`;
  const hoverBg = `hsl(${hue} 95% 92%)`;
  const ring = `hsl(${hue} 85% 75% / 0.55)`;
  return { bg, border, text, hoverBg, ring };
}
