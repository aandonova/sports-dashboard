import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { setLeague } from "../store/leagueSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { LeagueKey } from "../api/espn";

export function LeagueSelector() {
  const dispatch = useAppDispatch();
  const selectedLeague = useAppSelector((s) => s.league.selectedLeague);

  const handleChange = (value: LeagueKey) => {
    dispatch(setLeague(value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="league-label">League</InputLabel>
      <Select
        labelId="league-label"
        label="League"
        value={selectedLeague}
        onChange={(e) => handleChange(e.target.value as LeagueKey)}
      >
        <MenuItem value="NBA">NBA</MenuItem>
        <MenuItem value="NFL">NFL</MenuItem>
      </Select>
    </FormControl>
  );
}