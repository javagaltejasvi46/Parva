import { useEffect, useState } from "react";
import { api } from "../api/client";

const empty = { title: "", description: "", event_date: "", reward_tokens: 0 };

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);

  async function load() {
    const { data } = await api.get("/events");
    setEvents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    await api.post("/events", { ...form, reward_tokens: Number(form.reward_tokens) });
    setForm(empty);
    load();
  }

  async function rsvp(eventId) {
    await api.post(`/events/${eventId}/rsvp`);
    alert("RSVP successful");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Create Event (Admin/Club)</h3>
        <form className="space-y-2" onSubmit={createEvent}>
          <input className="w-full rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="w-full rounded border p-2" type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          <input className="w-full rounded border p-2" type="number" placeholder="Reward tokens" value={form.reward_tokens} onChange={(e) => setForm({ ...form, reward_tokens: e.target.value })} />
          <button className="rounded bg-slate-900 px-3 py-2 text-white">Create</button>
        </form>
      </div>
      <div className="space-y-2">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-xl bg-white p-4 shadow">
            <h4 className="font-semibold">{ev.title}</h4>
            <p className="text-sm text-slate-600">{ev.description}</p>
            <p className="text-xs text-slate-500">Reward: {ev.reward_tokens} tokens</p>
            <button className="mt-2 rounded border px-3 py-1 text-sm" onClick={() => rsvp(ev.id)}>
              RSVP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
