// Monogram initials for team members without a headshot:
// "Dr. James M. Miller, DVM" → "JM" (first + last name, titles/suffixes dropped).
export function initialsOf(name: string) {
  const words = name
    .replace(/^Dr\.?\s+/i, "")
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w));
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}
