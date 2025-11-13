// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const baseLink =
    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const inactive =
    "text-slate-300 hover:bg-slate-800 hover:text-white";
  const active = "bg-slate-800 text-white";

  return (
    <aside className="w-60 border-r border-slate-800 bg-slate-950/90 backdrop-blur-sm px-3 py-4">
      <div className="px-3 mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          IncidentHub
        </span>
        <p className="text-sm text-slate-300">Operations Console</p>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          Incidents
        </NavLink>

        <NavLink
          to="/incidents/create"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          New Incident
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? active : inactive}`
            }
          >
            Services
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
