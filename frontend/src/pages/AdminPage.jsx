import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [cashouts, setCashouts] = useState([]);

  async function load() {
    const [a, c] = await Promise.all([api.get("/admin/analytics"), api.get("/cashout/requests")]);
    setStats(a.data);
    setCashouts(c.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function approve(id) {
    await api.post(`/cashout/approve/${id}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="font-semibold">Analytics</h3>
        {stats && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <div>Total users: {stats.total_users}</div>
            <div>Total events: {stats.total_events}</div>
            <div>Attendance: {stats.total_attendance}</div>
            <div>Tokens: {stats.tokens_distributed}</div>
          </div>
        )}
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Cashout Requests</h3>
        <div className="space-y-2">
          {cashouts.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded border p-2 text-sm">
              <span>
                User #{c.user_id} - {c.tokens_requested} tokens - {c.status}
              </span>
              {c.status === "pending" && (
                <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => approve(c.id)}>
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
