
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GlobalAlertProvider } from "./components/GlobalAlertProvider";

createRoot(document.getElementById("root")!).render(
  <GlobalAlertProvider>
    <App />
  </GlobalAlertProvider>
);
