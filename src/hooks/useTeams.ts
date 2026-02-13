import { useMemo } from "react";
import type { LeagueKey } from "../api/espn";
import { useScoreboard } from "./useScoreboard";

type EspnTeam = {
    id?: string;
    displayName?: string;
    abbreviation?: string;
    logo?: string;
};

type EspnCompetitor = {
    team?: EspnTeam;
};

type EspnCompetition = {
    competitors?: EspnCompetitor[];
};

type EspnEvent = {
    competitions?: EspnCompetition[];
};

type EspnScoreboardResponse = {
    events?: EspnEvent[];
};

export type Team = {
    id: string;
    name: string;
    abbreviation: string;
    logo: string;
};

export function useTeams(league: LeagueKey, date?: string) {
    const scoreboard = useScoreboard(league, date);

    const teams = useMemo<Team[]>(() => {
        const data = scoreboard.data as EspnScoreboardResponse | undefined;
        const events = Array.isArray(data?.events) ? data.events : [];

        const map = new Map<string, Team>();

        for (const ev of events) {
            const comp = ev.competitions?.[0];
            const competitors = Array.isArray(comp?.competitors)
                ? comp.competitors
                : [];

            for (const c of competitors) {
                const t = c.team;
                if (!t) continue;

                const id = String(
                    t.id ?? t.abbreviation ?? t.displayName ?? ""
                );
                if (!id) continue;

                map.set(id, {
                    id,
                    name: t.displayName ?? "",
                    abbreviation: t.abbreviation ?? "",
                    logo: t.logo ?? "",
                });
            }
        }

        return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [scoreboard.data]);

    return { ...scoreboard, teams };
}