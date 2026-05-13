import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { LanguageProvider } from "./core/i18n";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
