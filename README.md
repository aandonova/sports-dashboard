# Sports Dashboard

Responsive dashboard built with React, TypeScript, Refine, MUI, React Query and Redux, using ESPN public endpoints (no API key required).

## Run
npm install
npm run dev

## Architecture

React Query → server state & caching

Redux Toolkit → global UI state (selected league)

Custom hooks → useScoreboard, useGameSummary, useTeams

Strong TypeScript typing (no unnecessary any) 

### Features

Scoreboard dashboard

Game details modal (summary endpoint)

Teams page + drawer

Responsive layout

Loading / error / empty states