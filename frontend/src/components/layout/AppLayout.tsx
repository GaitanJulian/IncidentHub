// src/components/layout/AppLayout.tsx
import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur">
          <h1 className="text-lg font-semibold">IncidentHub Admin</h1>

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
