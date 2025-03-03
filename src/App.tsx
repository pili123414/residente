import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ResidentsPage from "./pages/residents";
import ReportsPage from "./pages/reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/residents" element={<ResidentsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      {/* Add tempo routes if needed */}
      {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
    </Routes>
  );
}

export default App;
