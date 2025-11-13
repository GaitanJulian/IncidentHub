// src/pages/ServicesPage.tsx
import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createService, getServices } from "../api/servicesApi";
import { useAuth } from "../context/AuthContext";

const ServicesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: services, isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { mutateAsync, isPending: creating, isError: createError, error } = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setName("");
      setDescription("");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-slate-400">
            Manage services that incidents can be associated with.
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 max-w-xl">
          <h2 className="text-lg font-medium mb-3">Create new service</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-200 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Payments API, Authentication Service"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-1">
                Description (optional)
              </label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of what this service does..."
              />
            </div>

            {createError && (
              <p className="text-sm text-red-400">
                Failed to create service: {(error as any)?.response?.data?.message || "Unknown error"}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Service"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Existing services</h2>

        {isLoading && <p className="text-slate-400 text-sm">Loading services...</p>}
        {isError && <p className="text-red-400 text-sm">Failed to load services.</p>}

        {!isLoading && services?.length === 0 && (
          <p className="text-slate-400 text-sm">No services found.</p>
        )}

        {!isLoading && services?.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc: any) => (
                  <tr
                    key={svc.id}
                    className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                  >
                    <td className="px-4 py-2">{svc.name}</td>
                    <td className="px-4 py-2 text-slate-300">
                      {svc.description || "-"}
                    </td>
                    <td className="px-4 py-2 text-slate-400">
                      {svc.createdAt
                        ? new Date(svc.createdAt).toLocaleDateString()
                        : "-"}
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

export default ServicesPage;
