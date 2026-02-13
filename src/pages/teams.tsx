import React from "react";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Grid,
    Card,
    CardContent,
    Avatar,
    Drawer,
    Divider,
} from "@mui/material";

import type { LeagueKey } from "../api/espn";
import { LeagueSelector } from "../components/LeagueSelector";
import { useAppSelector } from "../store/hooks";
import { useTeams, type Team } from "../hooks/useTeams";
import { useScoreboard } from "../hooks/useScoreboard";
import { LoadingState, ErrorState, EmptyState } from "../components/States";

type EspnScoreboardResponse = {
    events?: Array<{
        id?: string;
        name?: string;
        competitions?: Array<{
            competitors?: Array<{
                team?: { id?: string };
            }>;
        }>;
        status?: { type?: { shortDetail?: string } };
    }>;
};

function TeamDetailsDrawer({
    open,
    onClose,
    team,
    league,
}: {
    open: boolean;
    onClose: () => void;
    team: Team | null;
    league: LeagueKey;
}) {
    const { data, isLoading, error } = useScoreboard(league);
    const teamGames = React.useMemo(() => {
        if (!team) return [];

        const events =
            Array.isArray((data as unknown as EspnScoreboardResponse | undefined)?.events)
                ? (data as unknown as EspnScoreboardResponse).events!
                : [];

        return events.filter((ev) => {
            const comp = ev.competitions?.[0];
            const competitors = Array.isArray(comp?.competitors)
                ? comp!.competitors!
                : [];

            return competitors.some(
                (c) => String(c.team?.id ?? "") === team.id
            );
        });
    }, [data, team]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 360, p: 2 }} >
                <Typography variant="h6" fontWeight={800}>
                    Team Details
                </Typography>

                <Divider sx={{ my: 2 }} />

                {!team ? (
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Select a team.
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={team.logo} sx={{ width: 44, height: 44 }} />
                            <Box>
                                <Typography fontWeight={800}>{team.name}</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                    {team.abbreviation} • ID: {team.id}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        <Typography fontWeight={700}>Games (from scoreboard)</Typography>

                        {isLoading && <LoadingState label="Loading games..." />}
                        {error && <ErrorState error={error} />}
                        {!isLoading && !error && teamGames.length === 0 && (
                            <EmptyState label="No games found for this team in the current scoreboard." />
                        )}

                        {!isLoading && !error && teamGames.length > 0 && (
                            <Stack spacing={1}>
                                {teamGames.slice(0, 6).map((ev, idx) => (
                                    <Paper
                                        key={ev.id ?? `${ev.name ?? "game"}-${idx}`}
                                        variant="outlined"
                                        sx={{ p: 1.25 }}
                                    >
                                        <Typography variant="body2" fontWeight={700}>
                                            {ev.name ?? "Game"}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                            {ev.status?.type?.shortDetail ?? ""}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                )}
            </Box>
        </Drawer>
    );
}

export function TeamsPage() {
    const selectedLeague = useAppSelector((s) => s.league.selectedLeague) as LeagueKey;

    const { teams, isLoading, error } = useTeams(selectedLeague);

    const [open, setOpen] = React.useState(false);
    const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

    const openTeam = (t: Team) => {
        setSelectedTeam(t);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setSelectedTeam(null);
    };

    React.useEffect(() => {
        setOpen(false);
        setSelectedTeam(null);
    }, [selectedLeague]);

    return (

        <Box sx={{ backgroundColor: "#f7f9fc", minHeight: "100vh" }} p={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
                    Teams
                </Typography>

                <LeagueSelector />
            </Stack>

            <Paper sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight={600}>
                    {selectedLeague} Teams
                </Typography>

                {isLoading && <LoadingState label="Loading teams..." />}
                {error && <ErrorState error={error} />}
                {!isLoading && !error && teams.length === 0 && (
                    <EmptyState label="No teams found." />
                )}

                {!isLoading && !error && teams.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {teams.map((t) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            boxShadow: 4,
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                    onClick={() => openTeam(t)}
                                >
                                    <CardContent>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar src={t.logo} alt={t.abbreviation} />
                                            <Box>
                                                <Typography fontWeight={800}>{t.name}</Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                                    {t.abbreviation}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            <TeamDetailsDrawer
                open={open}
                onClose={close}
                team={selectedTeam}
                league={selectedLeague}
            />
        </Box>
    );
}