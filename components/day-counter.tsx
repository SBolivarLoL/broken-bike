"use client";

import { useEffect, useState } from "react";

function daysSince(brokenAt?: string) {
  if (!brokenAt) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(brokenAt).getTime()) / 86_400_000));
}

export function DayCounter({ brokenAt }: { brokenAt?: string }) {
  const [days, setDays] = useState(() => daysSince(brokenAt));

  useEffect(() => {
    const timer = window.setInterval(() => setDays(daysSince(brokenAt)), 60_000);
    return () => window.clearInterval(timer);
  }, [brokenAt]);

  return (
    <div className="counter" aria-label={`${days} ${days === 1 ? "day" : "days"} since the last incident`}>
      <span>{days}</span>
      <p>{days === 1 ? "day" : "days"}<br />since the last incident</p>
    </div>
  );
}
