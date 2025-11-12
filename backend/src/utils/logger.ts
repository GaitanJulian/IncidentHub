export function log(level: "info" | "warn" | "error", message: string, meta?: unknown) {
  const entry = { level, message, meta, ts: new Date().toISOString() };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else console.log(line);
}
