import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getIncidents } from "../api/incidentsApi";
import { getServices } from "../api/servicesApi";
import { useNavigate } from "react-router-dom";

const IncidentsListPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "",
    serviceId: "",
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: incidents, isLoading, isError } = useQuery({
    queryKey: ["incidents", filters],
    queryFn: () => getIncidents(filters),
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-semibold mb-6">Incidents Dashboard</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="bg-slate-800 text-white px-4 py-2 rounded-md border border-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="INVESTIGATING">INVESTIGATING</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <select
          name="serviceId"
          value={filters.serviceId}
          onChange={handleChange}
          className="bg-slate-800 text-white px-4 py-2 rounded-md border border-slate-700"
        >
          <option value="">All Services</option>
          {services?.map((svc: any) => (
            <option key={svc.id} value={svc.id}>
              {svc.name}
            </option>
          ))}
        </select>

        <button
          className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          onClick={() => navigate("/incidents/create")}
        >
          + New Incident
        </button>
      </div>

      {/* Table */}
      {isLoading && <p>Loading incidents...</p>}
      {isError && <p className="text-red-400">Failed to load incidents</p>}

      {!isLoading && incidents?.length === 0 && (
        <p className="text-slate-400">No incidents found.</p>
      )}

      {!isLoading && incidents?.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Severity</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident: any) => (
                <tr
                  key={incident.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-4 py-3">{incident.title}</td>
                  <td className="px-4 py-3">{incident.service?.name}</td>
                  <td className="px-4 py-3">{incident.severity}</td>
                  <td className="px-4 py-3">{incident.status}</td>
                  <td className="px-4 py-3">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md"
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentsListPage;
