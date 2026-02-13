import React from "react";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Grid,
    CardContent,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from "@mui/material";

import { LeagueSelector } from "../components/LeagueSelector";
import { useAppSelector } from "../store/hooks";
import { useScoreboard } from "../hooks/useScoreboard";
import { useGameSummary } from "../hooks/useGameSummary";
import type { LeagueKey } from "../api/espn";
import { LoadingState, ErrorState, EmptyState } from "../components/States";
import { GameCard, GradientBadge, StatusDot } from "../components/styled";

type Team = {
    displayName?: string;
    abbreviation?: string;
    logo?: string;
};

type Competitor = {
    homeAway?: "home" | "away";
    score?: string;
    team?: Team;
};

type Competition = {
    id?: string;
    date?: string;
    competitors?: Competitor[];
};

type EspnEvent = {
    id?: string;
    date?: string;
    competitions?: Competition[];
    status?: {
        type?: {
            shortDetail?: string;
            description?: string;
        };
    };
};

type ScoreboardResponse = {
    events?: EspnEvent[];
};

type Game = {
    id: string;
    status: string;
    date: string;
    home: { name: string; short: string; logo: string; score: string };
    away: { name: string; short: string; logo: string; score: string };
};

function mapEventsToGames(data: ScoreboardResponse | undefined): Game[] {
    const events = Array.isArray(data?.events) ? data.events : [];

    return events.map((ev, idx) => {
        const comp = ev.competitions?.[0];
        const competitors = Array.isArray(comp?.competitors) ? comp.competitors : [];

        const home = competitors.find((c) => c.homeAway === "home");
        const away = competitors.find((c) => c.homeAway === "away");

        const date = ev.date ?? comp?.date ?? "unknown";

        return {
            id: ev.id ?? comp?.id ?? `${date}-${idx}`,
            status: ev.status?.type?.shortDetail ?? ev.status?.type?.description ?? "",
            date,
            home: {
                name: home?.team?.displayName ?? "Home",
                short: home?.team?.abbreviation ?? "",
                logo: home?.team?.logo ?? "",
                score: home?.score ?? "",
            },
            away: {
                name: away?.team?.displayName ?? "Away",
                short: away?.team?.abbreviation ?? "",
                logo: away?.team?.logo ?? "",
                score: away?.score ?? "",
            },
        };
    });
}

type SummaryDialogProps = {
    open: boolean;
    onClose: () => void;
    league: LeagueKey;
    eventId: string | null;
};

type SummaryTeam = {
    displayName?: string;
    abbreviation?: string;
    logo?: string;
};

type SummaryCompetitor = {
    homeAway?: "home" | "away";
    score?: string;
    team?: SummaryTeam;
};

type SummaryCompetition = {
    competitors?: SummaryCompetitor[];
    status?: { type?: { shortDetail?: string; description?: string } };
    headlines?: Array<{ headline?: string; shortLinkText?: string }>;
};

type SummaryResponse = {
    header?: { competitions?: SummaryCompetition[] };
    gameInfo?: {
        venue?: { fullName?: string; address?: { city?: string; state?: string } };
    };
};

const getStatusVariant = (status: string): "live" | "final" | "scheduled" => {
    const s = status.toLowerCase();

    if (s.includes("live") || s.includes("in progress")) return "live";
    if (s.includes("final")) return "final";

    return "scheduled";
};

function GameSummaryDialog({ open, onClose, league, eventId }: SummaryDialogProps) {
    const { data, isLoading, error } = useGameSummary(league, eventId);

    const summary = data as unknown as SummaryResponse | undefined;
    const comp = summary?.header?.competitions?.[0];

    const competitors = Array.isArray(comp?.competitors) ? comp!.competitors! : [];
    const home = competitors.find((c) => c.homeAway === "home");
    const away = competitors.find((c) => c.homeAway === "away");

    const status =
        comp?.status?.type?.shortDetail ?? comp?.status?.type?.description ?? "";

    const headline =
        comp?.headlines?.[0]?.headline ?? comp?.headlines?.[0]?.shortLinkText ?? "";

    const venue = summary?.gameInfo?.venue?.fullName ?? "";
    const city = summary?.gameInfo?.venue?.address?.city ?? "";
    const state = summary?.gameInfo?.venue?.address?.state ?? "";
    const location = [city, state].filter(Boolean).join(", ");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Game Details</DialogTitle>

            <DialogContent dividers>
                {isLoading && <LoadingState label="Loading details..." />}
                {error && <ErrorState error={error} />}
                {!isLoading && !error && !summary && <EmptyState label="No details found." />}

                {!isLoading && !error && summary && (
                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Stack spacing={1.2}>
                                {status && (
                                    <Typography variant="body2" fontWeight={700} sx={{ opacity: 0.85 }}>
                                        {status}
                                    </Typography>
                                )}

                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    {/* Away */}
                                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Avatar src={away?.team?.logo} sx={{ width: 34, height: 34 }} />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography fontWeight={800} noWrap>
                                                {away?.team?.abbreviation || away?.team?.displayName || "Away"}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
                                                {away?.team?.displayName ?? ""}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Typography fontWeight={900} fontSize={24}>
                                        {away?.score ?? "-"}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    {/* Home */}
                                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Avatar src={home?.team?.logo} sx={{ width: 34, height: 34 }} />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography fontWeight={800} noWrap>
                                                {home?.team?.abbreviation || home?.team?.displayName || "Home"}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
                                                {home?.team?.displayName ?? ""}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Typography fontWeight={900} fontSize={24}>
                                        {home?.score ?? "-"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>

                        {headline && (
                            <>
                                <Divider />
                                <Typography>{headline}</Typography>
                            </>
                        )}

                        {(venue || location) && (
                            <>
                                <Divider />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Venue: {venue}
                                    {location ? ` — ${location}` : ""}
                                </Typography>
                            </>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
export function DashboardPage() {
    const selectedLeague = useAppSelector((s) => s.league.selectedLeague) as LeagueKey;

    const { data, isLoading, error } = useScoreboard(selectedLeague);
    const games = mapEventsToGames(data as unknown as ScoreboardResponse | undefined);

    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);

    const openDetails = (eventId: string) => {
        setSelectedEventId(eventId);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedEventId(null);
    };

    return (
        <Box sx={{ backgroundColor: "#f7f9fc", minHeight: "100vh" }} p={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
                    Sports Dashboard
                </Typography>

                <LeagueSelector />
            </Stack>

            <Paper sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight={600}>
                    {selectedLeague} Scoreboard
                </Typography>

                {isLoading && <LoadingState label="Loading scoreboard..." />}
                {error && <ErrorState error={error} />}
                {!isLoading && !error && games.length === 0 && (
                    <EmptyState label="No games found." />
                )}

                {!isLoading && !error && games.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {games.map((g) => (
                            <Grid item xs={12} md={6} lg={4} key={g.id}>
                                <GameCard
                                    variant="outlined"
                                    sx={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            boxShadow: 4,
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                    onClick={() => openDetails(g.id)}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box display="flex" alignItems="center">
                                                <StatusDot variant={getStatusVariant(g.status)} />
                                                <Typography fontWeight={700} variant="body2">
                                                    {g.status}
                                                </Typography>
                                            </Box>

                                            <GradientBadge label={selectedLeague} size="small" />
                                        </Box>

                                        <Stack spacing={1} sx={{ mt: 1 }}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Avatar
                                                        src={g.away.logo}
                                                        alt={g.away.short}
                                                        sx={{ width: 28, height: 28 }}
                                                    />
                                                    <Typography fontWeight={600}>{g.away.short || g.away.name}</Typography>
                                                </Stack>
                                                <Typography fontWeight={800} fontSize={22}>
                                                    {g.away.score}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Avatar
                                                        src={g.home.logo}
                                                        alt={g.home.short}
                                                        sx={{ width: 28, height: 28 }}
                                                    />
                                                    <Typography fontWeight={600}>{g.home.short || g.home.name}</Typography>
                                                </Stack>
                                                <Typography fontWeight={700}>{g.home.score}</Typography>
                                            </Stack>

                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                {g.date ? new Date(g.date).toLocaleString() : ""}
                                            </Typography>

                                            <Button
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDetails(g.id);
                                                }}
                                            >
                                                More info
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </GameCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            <GameSummaryDialog
                open={detailsOpen}
                onClose={closeDetails}
                league={selectedLeague}
                eventId={selectedEventId}
            />
        </Box>
    );
}