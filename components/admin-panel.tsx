"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminPanel({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const endpoint = signedIn ? "/api/admin/reset" : "/api/admin/login";
    const payload = signedIn ? { note } : { password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Something went wrong.");

      if (signedIn) setNote("");
      else setPassword("");
      setOpen(false);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="admin-area">
      <button className="admin-button" onClick={() => { setOpen(!open); setError(""); }} aria-expanded={open}>
        {signedIn ? "Admin tools" : "Admin access"}
      </button>
      {open && (
        <div className="admin-popover">
          <p className="popover-label">{signedIn ? "Log a fresh bike failure" : "Private area"}</p>
          <form onSubmit={submit}>
            {signedIn ? (
              <>
                <label htmlFor="note">What happened?</label>
                <textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} placeholder="e.g. Chain snapped halfway home" required />
                <p className="hint">This restarts the counter at zero.</p>
              </>
            ) : (
              <>
                <label htmlFor="password">Shared admin password</label>
                <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              </>
            )}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="submit-button" disabled={busy}>{busy ? "One moment…" : signedIn ? "Restart counter" : "Unlock admin tools"}</button>
          </form>
          {signedIn && <button className="logout" onClick={logout}>Sign out</button>}
        </div>
      )}
    </div>
  );
}
