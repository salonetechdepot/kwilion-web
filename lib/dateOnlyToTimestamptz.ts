function toDateOnlyString(v: any): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;

  // if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // if ISO/timestamp, normalize to YYYY-MM-DD in UTC
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return null;

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function dateOnlyToTimestamptz(v: any): string | null {
  const d = toDateOnlyString(v);
  return d ? `${d}T00:00:00.000Z` : null;
}
