import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider,
} from "@mui/material";
import type { LeagueKey } from "../api/espn";
import { useGameSummary } from "../hooks/useGameSummary";

type Props = {
    open: boolean;
    onClose: () => void;
    league: LeagueKey;
    eventId: string | null;
};

export function GameDetailsDialog({ open, onClose, league, eventId }: Props) {
    const { data, isLoading, error } = useGameSummary(league, eventId);

    const headline =
        data?.header?.competitions?.[0]?.headlines?.[0]?.shortLinkText ??
        data?.header?.competitions?.[0]?.headlines?.[0]?.headline ??
        "";

    const status =
        data?.header?.competitions?.[0]?.status?.type?.shortDetail ??
        data?.header?.competitions?.[0]?.status?.type?.description ??
        "";

    const venue = data?.gameInfo?.venue?.fullName ?? "";
    const location = data?.gameInfo?.venue?.address
        ? `${data.gameInfo.venue.address.city ?? ""} ${data.gameInfo.venue.address.state ?? ""}`.trim()
        : "";

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Game Details</DialogTitle>

            <DialogContent dividers>
                {isLoading && <Typography>Loading details...</Typography>}

                {error && (
                    <Typography color="error">
                        {error instanceof Error ? error.message : "Something went wrong"}
                    </Typography>
                )}

                {!isLoading && !error && data && (
                    <Stack spacing={1.5}>
                        {status && <Typography fontWeight={600}>{status}</Typography>}

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