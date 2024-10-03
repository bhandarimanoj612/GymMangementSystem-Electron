import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <HashRouter>
        <App />
      </HashRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
