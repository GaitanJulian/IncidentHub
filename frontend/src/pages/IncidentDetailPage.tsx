// src/pages/IncidentDetailPage.tsx
import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addIncidentComment,
  getIncidentById,
  updateIncidentStatus,
} from "../api/incidentsApi";

const statusOptions = ["OPEN", "INVESTIGATING", "RESOLVED"] as const;

const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");

  const {
    data: incident,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["incident", id],
    queryFn: () => getIncidentById(id as string),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: updateIncidentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", id] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: addIncidentComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", id] });
      setNewComment("");
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!id) return;
    const status = e.target.value as "OPEN" | "INVESTIGATING" | "RESOLVED";
    statusMutation.mutate({ id, status });
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    commentMutation.mutate({ id, content: newComment.trim() });
  };

  if (isLoading) {
    return <p className="text-slate-300 text-sm">Loading incident...</p>;
  }

  if (isError || !incident) {
    return (
      <div className="space-y-3">
        <p className="text-red-400 text-sm">Failed to load incident.</p>
        <button
          onClick={() => navigate("/incidents")}
          className="text-sm text-slate-300 hover:text-white underline"
        >
          Back to incidents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/incidents")}
            className="text-xs text-slate-400 hover:text-slate-200 mb-2"
          >
            ← Back to incidents
          </button>
          <h1 className="text-2xl font-semibold mb-1">{incident.title}</h1>
          <p className="text-sm text-slate-400">
            Incident ID: <span className="font-mono">{incident.id}</span>
          </p>
        </div>

        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-slate-400">Status</span>
            <select
              value={incident.status}
              onChange={handleStatusChange}
              disabled={statusMutation.isPending}
              className="bg-slate-900 border border-slate-700 rounded-md text-xs px-2 py-1 text-slate-100"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs">
            Severity:{" "}
            <span className="ml-1 font-semibold text-amber-300">
              {incident.severity}
            </span>
          </span>
        </div>
      </div>

      {/* Main info + metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-2">Description</h2>
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {incident.description}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-3">Comments</h2>

            {incident.comments?.length === 0 && (
              <p className="text-sm text-slate-400">
                No comments yet. Use the form below to add the first update.
              </p>
            )}

            <div className="space-y-3">
              {incident.comments?.map((comment: any) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
                >
                  <p className="text-sm text-slate-100 whitespace-pre-line">
                    {comment.content}
                  </p>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                    <span>{comment.author?.name ?? "Unknown user"}</span>
                    <span>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-4 space-y-2">
              <label className="block text-xs text-slate-300">
                Add a new comment
              </label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add an update, investigation note or resolution details..."
              />
              {commentMutation.isError && (
                <p className="text-xs text-red-400">
                  Failed to add comment. Try again.
                </p>
              )}
              <button
                type="submit"
                disabled={commentMutation.isPending}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-xs font-medium disabled:opacity-60"
              >
                {commentMutation.isPending ? "Adding..." : "Add comment"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm space-y-2">
            <h2 className="text-sm font-semibold mb-2">Metadata</h2>
            <p>
              <span className="text-slate-400">Service:</span>{" "}
              {incident.service?.name ?? "-"}
            </p>
            <p>
              <span className="text-slate-400">Reporter:</span>{" "}
              {incident.reporter?.name ?? incident.reporter?.email ?? "-"}
            </p>
            <p>
              <span className="text-slate-400">Created:</span>{" "}
              {incident.createdAt
                ? new Date(incident.createdAt).toLocaleString()
                : "-"}
            </p>
            <p>
              <span className="text-slate-400">Last update:</span>{" "}
              {incident.updatedAt
                ? new Date(incident.updatedAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
