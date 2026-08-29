// Logs an event at most once per browser, so a single visitor clicking a
// button repeatedly (or revisiting a page) doesn't inflate admin stats.
// Uses localStorage as the "have I already sent this?" record - not tied
// to a real user account, just this browser.
export function trackEventOnce(type: string) {
  const storageKey = `signWranglersLogged_${type}`;

  if (localStorage.getItem(storageKey)) {
    return;
  }

  localStorage.setItem(storageKey, "true");

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  }).catch(() => {});
}
