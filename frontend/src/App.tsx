import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {type JSX} from "react";
import LoginPage from "./pages/LoginPage";
import IncidentsListPage from "./pages/IncidentsListPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ServicesPage from "./pages/ServicesPage";
import AppLayout from "./components/layout/AppLayout";

const App = () => {
  const { isAuthenticated } = useAuth();

  const withLayout = (component: JSX.Element) => (
    <AppLayout>{component}</AppLayout>
  );

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
          isAuthenticated
            ? withLayout(<IncidentsListPage />)
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/incidents/create"
        element={
          isAuthenticated
            ? withLayout(<CreateIncidentPage />)
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/incidents/:id"
        element={
          isAuthenticated
            ? withLayout(<IncidentDetailPage />)
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/services"
        element={
          isAuthenticated
            ? withLayout(<ServicesPage />)
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default App;
