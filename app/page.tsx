import { cookies } from "next/headers";
import Link from "next/link";

import { AdminPanel } from "@/components/admin-panel";
import { DayCounter } from "@/components/day-counter";
import { adminCookie, isAdmin } from "@/lib/auth";
import { getBikeRecord } from "@/lib/store";

export const dynamic = "force-dynamic";

function readableDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export default async function Home() {
  const [record, cookieStore] = await Promise.all([getBikeRecord(), cookies()]);
  const admin = await isAdmin(cookieStore.get(adminCookie.name)?.value);

  return (
    <main className="shell">
      <nav>
        <Link className="wordmark" href="/" aria-label="Broken bike home">
          <span className="wheel small-wheel" />
          Broken bike bureau
        </Link>
        <AdminPanel signedIn={admin} />
      </nav>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Officially unofficial since forever</p>
        <h1 id="page-title">Days since Geert&apos;s bike <em>did a bike thing.</em></h1>

        <DayCounter key={record?.brokenAt ?? "no-record"} brokenAt={record?.brokenAt} />
      </section>

      <section className="incident" aria-label="Latest incident">
        <div className="incident-icon" aria-hidden="true">↯</div>
        <div>
          <p className="eyebrow">Latest incident</p>
          {record ? (
            <>
              <h2>{record.note}</h2>
              <p className="date">Counter restarted {readableDate(record.brokenAt)}.</p>
            </>
          ) : (
            <>
              <h2>No incident has been logged yet.</h2>
              <p className="date">A remarkably hopeful place to begin.</p>
            </>
          )}
        </div>
      </section>

      <footer>May the next ride be uneventful. <span>✦</span></footer>
    </main>
  );
}
