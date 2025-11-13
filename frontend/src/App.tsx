// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import IncidentsListPage from "./pages/IncidentsListPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/incidents" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/incidents"
        element={
          isAuthenticated ? <IncidentsListPage /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/incidents/create"
        element={
          isAuthenticated ? <CreateIncidentPage /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default App;
