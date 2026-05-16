import { useState } from "react";
import Icon from "@/components/ui/icon";
import { userApi, User } from "@/lib/userApi";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: User) => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!username || !password) {
      setError("Заполни никнейм и пароль");
      return;
    }
    setLoading(true);
    setError("");
    const res = await userApi(mode, { username, password });
    setLoading(false);
    if (res.ok) {
      onSuccess(res.token, res.user);
      setUsername("");
      setPassword("");
      onClose();
    } else {
      setError(res.error || "Что-то пошло не так");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(7,7,17,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{
          background: "var(--card-bg)",
          border: "1px solid rgba(168,85,247,0.4)",
          boxShadow: "0 0 60px rgba(168,85,247,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <Icon name="X" size={18} />
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["register", "login"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl font-orbitron text-xs tracking-widest transition-all"
              style={{
                background: mode === m ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${mode === m ? "var(--neon-purple)" : "rgba(255,255,255,0.08)"}`,
                color: mode === m ? "var(--neon-purple)" : "rgba(255,255,255,0.4)",
              }}
            >
              {m === "register" ? "РЕГИСТРАЦИЯ" : "ВХОД"}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="font-orbitron text-2xl font-black mb-1 gradient-text-purple-cyan">
            {mode === "register" ? "Создай аккаунт" : "С возвращением"}
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {mode === "register" ? "чтобы общаться в чате" : "входи и пиши в чат"}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>НИКНЕЙМ</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="DarkKnight"
              maxLength={32}
              className="w-full px-4 py-3 rounded-lg outline-none text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
            />
          </div>
          <div>
            <div className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>ПАРОЛЬ</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="мин. 4 символа"
              className="w-full px-4 py-3 rounded-lg outline-none text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
            />
          </div>

          {error && (
            <div
              className="px-3 py-2 rounded-lg text-sm text-center"
              style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff8888" }}
            >
              {error}
            </div>
          )}

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
            {loading ? "ЗАГРУЗКА..." : mode === "register" ? "СОЗДАТЬ АККАУНТ" : "ВОЙТИ"}
          </button>
        </div>

        <div className="text-xs text-center mt-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {mode === "register" ? "Уже зарегистрирован?" : "Нет аккаунта?"}{" "}
          <button
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            style={{ color: "var(--neon-cyan)" }}
            className="hover:underline"
          >
            {mode === "register" ? "Войти" : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
