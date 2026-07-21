"use client";

import { useEffect, useState } from "react";
import { daysSinceInBrussels, millisecondsUntilNextBrusselsMidnight } from "@/lib/days";

export function DayCounter({ brokenAt }: { brokenAt?: string }) {
  const [days, setDays] = useState(() => (brokenAt ? daysSinceInBrussels(brokenAt) : 0));

  useEffect(() => {
    if (!brokenAt) return;

    let timer: number;
    const updateAtMidnight = () => {
      setDays(daysSinceInBrussels(brokenAt));
      timer = window.setTimeout(updateAtMidnight, millisecondsUntilNextBrusselsMidnight());
    };
    timer = window.setTimeout(updateAtMidnight, millisecondsUntilNextBrusselsMidnight());
    return () => window.clearTimeout(timer);
  }, [brokenAt]);

  return (
    <div className="counter" aria-label={`${days} ${days === 1 ? "day" : "days"} since the last incident`}>
      <span>{days}</span>
      <p>{days === 1 ? "day" : "days"}<br />since the last incident</p>
    </div>
  );
}
