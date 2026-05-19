import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { LanguageProvider } from "./core/i18n";
import { AnimationPreferencesProvider } from "./core/preferences/AnimationPreferencesProvider";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AnimationPreferencesProvider>
        <App />
      </AnimationPreferencesProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
