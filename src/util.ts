export const oneLine = (s: string) => s.replace(/(.*)(?:\r?\n|\r)?[^]*/, '$1')

export const findValue = <T>(obj: {[key: string]: T}, value: T): string | null => {
  return Object.entries(obj).find(([, val]) => val === value)?.[0] ?? null
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max))
}
