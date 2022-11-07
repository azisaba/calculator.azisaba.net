export const oneLine = (s: string) => s.replace(/(.*)(?:\r?\n|\r)?[^]*/, '$1')

export const findValue = <T>(obj: {[key: string]: T}, value: T): string | null => {
  return Object.entries(obj).find(([, val]) => val === value)?.[0] ?? null
}
