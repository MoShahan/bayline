import { Navigate, Route, Routes } from "react-router-dom";

import App from "@/src/App";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
