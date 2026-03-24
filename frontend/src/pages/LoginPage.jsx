import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", college_id: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "register") {
      await register({ ...form, role: "student" });
    }
    await login(form.email, form.password);
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">{mode === "login" ? "Login" : "Create account"}</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <input className="w-full rounded border p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full rounded border p-2" placeholder="College ID" onChange={(e) => setForm({ ...form, college_id: e.target.value })} />
          </>
        )}
        <input className="w-full rounded border p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded bg-slate-900 p-2 text-white" type="submit">
          Continue
        </button>
      </form>
      <button className="mt-3 text-sm text-blue-600" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </div>
  );
}
