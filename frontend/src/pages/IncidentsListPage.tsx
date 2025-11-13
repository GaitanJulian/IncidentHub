// src/pages/IncidentsListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getIncidents } from "../api/incidentsApi";
import { getServices } from "../api/servicesApi";

type Incident = {
  id: string;
  title: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  service?: { name: string };
};

type Service = {
  id: string;
  name: string;
};

const statusLabel: Record<Incident["status"], string> = {
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  RESOLVED: "Resolved",
};

const severityLabel: Record<Incident["severity"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function getStatusClasses(status: Incident["status"]) {
  switch (status) {
    case "OPEN":
      return "bg-rose-900/40 text-rose-200 border border-rose-700";
    case "INVESTIGATING":
      return "bg-amber-900/40 text-amber-200 border border-amber-700";
    case "RESOLVED":
      return "bg-emerald-900/30 text-emerald-200 border border-emerald-700";
    default:
      return "bg-slate-800 text-slate-200 border border-slate-700";
  }
}

function getSeverityClasses(severity: Incident["severity"]) {
  switch (severity) {
    case "LOW":
      return "bg-slate-800 text-slate-200 border border-slate-700";
    case "MEDIUM":
      return "bg-blue-900/40 text-blue-200 border border-blue-700";
    case "HIGH":
      return "bg-orange-900/50 text-orange-200 border border-orange-700";
    case "CRITICAL":
      return "bg-red-900/60 text-red-200 border border-red-700";
    default:
      return "bg-slate-800 text-slate-200 border border-slate-700";
  }
}

const IncidentsListPage = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<Incident["status"] | "ALL">(
    "OPEN"
  );
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");

  const {
    data: services,
    isLoading: loadingServices,
  } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const {
    data: incidents,
    isLoading: loadingIncidents,
    refetch,
  } = useQuery<Incident[]>({
    queryKey: ["incidents", statusFilter, serviceFilter],
    queryFn: () =>
      getIncidents({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        serviceId: serviceFilter === "ALL" ? undefined : serviceFilter,
      }),
  });

  // Refrescar cuando cambien filtros
  useEffect(() => {
    refetch();
  }, [statusFilter, serviceFilter, refetch]);

  const handleNewIncident = () => {
    navigate("/incidents/create");
  };

  const handleView = (id: string) => {
    navigate(`/incidents/${id}`);
  };

  const isLoading = loadingIncidents || loadingServices;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Incidents Dashboard</h1>
          <p className="text-sm text-slate-400">
            Track open issues, investigate incidents and follow their resolution.
          </p>
        </div>

        <button
          onClick={handleNewIncident}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium shadow-md shadow-blue-900/40"
        >
          + New Incident
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as Incident["status"] | "ALL")
            }
            className="bg-slate-900 border border-slate-700 rounded-md text-sm px-3 py-2 text-slate-100"
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Service
          </label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md text-sm px-3 py-2 text-slate-100 min-w-[180px]"
          >
            <option value="ALL">All services</option>
            {services?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">
            Loading incidents...
          </div>
        ) : !incidents || incidents.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">
            No incidents found for the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Service</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Severity</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-100 max-w-sm">
                      <div className="truncate">{incident.title}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {incident.service?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                          getStatusClasses(incident.status)
                        }
                      >
                        {statusLabel[incident.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                          getSeverityClasses(incident.severity)
                        }
                      >
                        {severityLabel[incident.severity]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {incident.createdAt
                        ? new Date(incident.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleView(incident.id)}
                        className="text-xs font-medium text-blue-300 hover:text-blue-100"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentsListPage;
