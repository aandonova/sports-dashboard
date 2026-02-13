import React from "react";
import ReactDOM from "react-dom/client";

import { Routes, Route } from "react-router";
import { DashboardPage } from "./pages/dashboard";
import { TeamsPage } from "./pages/teams";

import { BrowserRouter } from "react-router";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemedLayout } from "@refinedev/mui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Provider store={store}>
          <Refine
            routerProvider={routerProvider}
            resources={[
              {
                name: "teams",
                list: "/teams",
                meta: {
                  icon: <SportsBasketballIcon />
                }
              }
            ]}
          >
            <ThemedLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="teams" element={<TeamsPage />} />
              </Routes>
            </ThemedLayout>
          </Refine>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);