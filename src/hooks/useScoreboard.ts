import { useQuery } from "@tanstack/react-query";
import { fetchScoreboard, type LeagueKey } from "../api/espn";

export function useScoreboard(league: LeagueKey, date?: string) {
  return useQuery({
    queryKey: ["espn", "scoreboard", league, date ?? "today"],
    queryFn: () => fetchScoreboard(league, { date }),
    staleTime: 30_000,
    retry: 1,
  });
}