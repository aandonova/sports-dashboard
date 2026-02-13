import { useQuery } from "@tanstack/react-query";
import { fetchGameSummary, type LeagueKey } from "../api/espn";

export function useGameSummary(
    league: LeagueKey,
    eventId: string | null
) {
    return useQuery({
        queryKey: ["espn", "summary", league, eventId],
        queryFn: () => {
            if (!eventId) throw new Error("Missing eventId");
            return fetchGameSummary(league, eventId);
        },
        enabled: Boolean(eventId),
        staleTime: 60_000,
        retry: 1,
    });
}