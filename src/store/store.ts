import { configureStore } from "@reduxjs/toolkit";
import leagueReducer from "./leagueSlice";

export const store = configureStore({
    reducer: {
        league: leagueReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;