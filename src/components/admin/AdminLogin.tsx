import { useState } from "react";
import { API_URL } from "./types";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    }).then((r) => r.json());
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("admin_token", res.token);
      onLogin(res.token);
    } else {
      setError(res.error || "Ошибка входа");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--dark-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 60px rgba(168,85,247,0.1)" }}
      >
        <div className="text-center mb-8">
          <div className="font-orbitron font-black text-2xl mb-1" style={{ color: "var(--neon-purple)" }}>ADMIN</div>
          <div className="text-xs font-orbitron tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>ПАНЕЛЬ УПРАВЛЕНИЯ</div>
        </div>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Введи пароль..."
            className="w-full px-4 py-3 rounded-lg outline-none text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.4)", color: "white" }}
            autoFocus
          />
          {error && <div className="text-sm text-center" style={{ color: "#ff6666" }}>{error}</div>}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-orbitron font-bold tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(0,255,255,0.2))",
              border: "1px solid var(--neon-purple)",
              color: "white",
            }}
          >
            {loading ? "ВХОДИМ..." : "ВОЙТИ"}
          </button>
        </div>
      </div>
    </div>
  );
}
