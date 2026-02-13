import { Alert, Box, CircularProgress, Typography } from "@mui/material";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
            <CircularProgress size={18} />
            <Typography>{label}</Typography>
        </Box>
    );
}

export function ErrorState({ error }: { error: unknown }) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return (
        <Alert severity="error" sx={{ mt: 1 }}>
            {message}
        </Alert>
    );
}

export function EmptyState({ label = "No data found." }: { label?: string }) {
    return (
        <Typography sx={{ mt: 1, opacity: 0.7 }}>
            {label}
        </Typography>
    );
}