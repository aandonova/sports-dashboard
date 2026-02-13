import { styled } from "@mui/material/styles";
import { Card, Chip, Box } from "@mui/material";

export const GameCard = styled(Card)(({ theme }) => ({
    cursor: "pointer",
    borderRadius: 18,
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 180ms ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[6],
        borderColor: theme.palette.primary.light,
    },
}));

export const GradientBadge = styled(Chip)(() => ({
    fontWeight: 700,
    letterSpacing: 0.4,
    background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
    color: "#fff",
    height: 24,
}));

export const StatusDot = styled(Box)<{ variant?: "live" | "final" | "scheduled" }>(
    ({ variant = "scheduled" }) => {
        const colors = {
            live: "#e53935",
            final: "#43a047",
            scheduled: "#757575",
        };

        return {
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: colors[variant],
            marginRight: 6,
        };
    }
);