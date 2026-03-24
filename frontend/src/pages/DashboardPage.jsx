import { useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { getMetaMaskAddress } from "../api/blockchain";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, syncWallet, logout } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [bal, hist] = await Promise.all([api.get("/wallet/balance"), api.get("/wallet/history")]);
        setBalance(bal.data.token_balance);
        setHistory(hist.data);
      } catch {
        setBalance(0);
        setHistory([]);
      }
    }
    if (user) load();
  }, [user]);

  async function connectMetaMask() {
    try {
      await syncWallet(await getMetaMaskAddress());
    } catch {
      alert("Install and unlock MetaMask");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">Welcome, {user?.name}</h2>
        <p className="text-sm text-slate-600">Token Balance: {balance}</p>
        <p className="text-sm text-slate-600">Wallet: {user?.wallet_address || "Not connected"}</p>
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-slate-900 px-3 py-1 text-white" onClick={connectMetaMask}>
            Connect MetaMask
          </button>
          <button className="rounded border px-3 py-1" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Activity History</h3>
        <ul className="space-y-2 text-sm">
          {history.map((h) => (
            <li key={`${h.event_id}-${h.created_at}`} className="rounded border p-2">
              Event #{h.event_id} - +{h.tokens_awarded} tokens ({h.tx_hash || "off-chain"})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
