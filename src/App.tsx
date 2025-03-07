import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./components/home";
import ResidentsPage from "./pages/residents";
import ReportsPage from "./pages/reports";
import { SupabaseProvider } from "./components/SupabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* Add tempo routes if needed */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}

        {/* Redirect to home for any unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </SupabaseProvider>
  );
}

export default App;
