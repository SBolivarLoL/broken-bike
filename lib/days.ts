const brusselsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Brussels",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

type BrusselsDate = { year: number; month: number; day: number };

function brusselsDate(date: Date): BrusselsDate {
  const parts = brusselsFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function dayStamp({ year, month, day }: BrusselsDate) {
  return Date.UTC(year, month - 1, day);
}

function brusselsTimeStamp(date: Date) {
  const parts = brusselsFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
}

export function daysSinceInBrussels(brokenAt: string, now = new Date()) {
  return Math.max(0, Math.round((dayStamp(brusselsDate(now)) - dayStamp(brusselsDate(new Date(brokenAt)))) / 86_400_000));
}

export function millisecondsUntilNextBrusselsMidnight(now = new Date()) {
  const today = brusselsDate(now);
  const tomorrow = new Date(Date.UTC(today.year, today.month - 1, today.day + 1));
  const nextMidnightAsUtc = Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate());
  const brusselsOffset = brusselsTimeStamp(new Date(nextMidnightAsUtc)) - nextMidnightAsUtc;
  return Math.max(100, nextMidnightAsUtc - brusselsOffset - now.getTime() + 100);
}
