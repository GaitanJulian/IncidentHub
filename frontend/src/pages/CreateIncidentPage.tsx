// src/pages/CreateIncidentPage.tsx
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getServices } from "../api/servicesApi";
import { createIncident } from "../api/incidentsApi";

const CreateIncidentPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");

  const { data: services, isPending: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { mutateAsync, isPending: creating, isError, error } = useMutation({
    mutationFn: createIncident,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !description || !serviceId) {
      return;
    }

    try {
      await mutateAsync({
        title,
        description,
        serviceId,
        severity,
      });

      navigate("/incidents");
    } catch (err) {
      console.error("Error creating incident", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Create Incident</h1>
          <button
            onClick={() => navigate("/incidents")}
            className="text-sm text-slate-300 hover:text-white"
          >
            Back to list
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-200 mb-1">Title</label>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the incident"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Description</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what happened..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-200 mb-1">Service</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
                disabled={loadingServices}
              >
                <option value="">Select a service</option>
                {services?.map((svc: any) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-1">Severity</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL")
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-red-400">
              Failed to create incident: {(error as any)?.response?.data?.message || "Unknown error"}
            </p>
          )}

          <button
            type="submit"
            disabled={creating}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Incident"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentPage;
