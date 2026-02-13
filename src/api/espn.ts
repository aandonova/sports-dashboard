const ESPN_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports";

export type LeagueKey = "NBA" | "NFL";

const leaguePathMap: Record<LeagueKey, string> = {
  NBA: "basketball/nba",
  NFL: "football/nfl",
};

export type ScoreboardParams = {
  date?: string;
};

export async function fetchScoreboard(
  league: LeagueKey,
  params: ScoreboardParams = {}
) {
  const path = leaguePathMap[league];
  const url = new URL(`${ESPN_BASE_URL}/${path}/scoreboard`);

  if (params.date) url.searchParams.set("dates", params.date);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`ESPN request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchGameSummary(league: LeagueKey, eventId: string) {
  const path = leaguePathMap[league];
  const url = new URL(`${ESPN_BASE_URL}/${path}/summary`);
  url.searchParams.set("event", eventId);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`ESPN summary failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}