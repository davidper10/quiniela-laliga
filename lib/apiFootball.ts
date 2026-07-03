const API_BASE_URL = "https://v3.football.api-sports.io";

export async function apiFootballFetch<T>(
  path: string,
  params: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": process.env.API_FOOTBALL_KEY!,
      "x-apisports-host": process.env.API_FOOTBALL_HOST!,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API-Football error ${response.status}`);
  }

  return response.json();
}