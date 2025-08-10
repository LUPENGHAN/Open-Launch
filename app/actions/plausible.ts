// app/actions/plausible.ts  —— 使用 v1 /stats/aggregate
const BASE = process.env.PLAUSIBLE_URL!
const KEY = process.env.PLAUSIBLE_API_KEY!
const SITE = process.env.PLAUSIBLE_SITE_ID! // 本地=localhost

function buildV1(metricsCSV: string) {
  const u = new URL(`${BASE}/api/v1/stats/aggregate`)
  u.searchParams.set("site_id", SITE)
  u.searchParams.set("period", "30d")
  u.searchParams.set("metrics", metricsCSV)
  return u.toString()
}

async function fetchAgg(metricsCSV: string) {
  const url = buildV1(metricsCSV)
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KEY}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`plausible v1 http ${res.status}`)
  return res.json() as Promise<{ results: Record<string, { value: number }> }>
}

export async function getLast30DaysVisitors(): Promise<number> {
  try {
    const j = await fetchAgg("visitors")
    return j.results.visitors?.value ?? 0
  } catch {
    return 0
  }
}

export async function getLast30DaysPageviews(): Promise<number> {
  try {
    const j = await fetchAgg("pageviews")
    return j.results.pageviews?.value ?? 0
  } catch {
    return 0
  }
}
