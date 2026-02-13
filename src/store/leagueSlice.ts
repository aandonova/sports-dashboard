import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LeagueKey } from "../api/espn";

type LeagueState = {
    selectedLeague: LeagueKey;
};

const initialState: LeagueState = {
    selectedLeague: "NBA",
};

const leagueSlice = createSlice({
    name: "league",
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<LeagueKey>) {
            state.selectedLeague = action.payload;
        },
    },
});

export const { setLeague } = leagueSlice.actions;
export default leagueSlice.reducer;