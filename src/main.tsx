import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { store } from "@/src/app/store";
import { AppRouter } from "@/src/AppRouter";

import "./index.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <AppRouter />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
