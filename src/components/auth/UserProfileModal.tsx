import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { userApi, User } from "@/lib/userApi";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  user: User;
  onUpdate: (patch: Partial<User>) => void;
  onLogout: () => void;
}

const COLORS = ["#a855f7", "#00ffff", "#00ff88", "#ff00aa", "#ffd700", "#ff6b6b", "#ffa500", "#ffffff"];

export default function UserProfileModal({ open, onClose, token, user, onUpdate, onLogout }: UserProfileModalProps) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой (макс 5 МБ)");
      return;
    }
    setUploading(true);
    setError("");
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const res = await userApi("upload_avatar", { image_b64: b64, ext }, token);
      setUploading(false);
      if (res.ok) {
        onUpdate({ avatar_url: res.avatar_url });
      } else {
        setError(res.error || "Не удалось загрузить");
      }
    };
    reader.readAsDataURL(file);
  };

  const setColor = async (color: string) => {
    setSaving(true);
    const res = await userApi("update_profile", { color }, token);
    setSaving(false);
    if (res.ok) onUpdate({ color });
  };

  const created = new Date(user.created_at);
  const dateStr = created.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });

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

        <div className="font-orbitron text-xs tracking-widest mb-6" style={{ color: "var(--neon-purple)" }}>
          МОЙ ПРОФИЛЬ
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="relative w-28 h-28 rounded-full overflow-hidden transition-all hover:scale-105 group"
            style={{
              border: `2px solid ${user.color}`,
              boxShadow: `0 0 25px ${user.color}80`,
            }}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-orbitron font-black text-3xl"
                style={{ background: `linear-gradient(135deg, ${user.color}40, ${user.color}10)`, color: user.color }}
              >
                {user.username[0]?.toUpperCase()}
              </div>
            )}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <Icon name={uploading ? "Loader" : "Camera"} size={22} style={{ color: "white" }} />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
          <div className="font-orbitron font-bold text-lg mt-3" style={{ color: user.color }}>
            {user.username}
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            с нами с {dateStr}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-6">
          <div className="text-xs mb-3 font-orbitron tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
            ЦВЕТ НИКА В ЧАТЕ
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                disabled={saving}
                className="w-10 h-10 rounded-lg transition-all hover:scale-110 relative"
                style={{
                  background: c,
                  boxShadow: user.color === c ? `0 0 15px ${c}` : "none",
                  border: user.color === c ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {user.color === c && (
                  <Icon name="Check" size={16} style={{ color: "white", margin: "auto" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="px-3 py-2 rounded-lg text-sm text-center mb-4"
            style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff8888" }}
          >
            {error}
          </div>
        )}

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full py-3 rounded-xl font-orbitron text-xs tracking-widest transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(255,0,0,0.1)",
            border: "1px solid rgba(255,0,0,0.3)",
            color: "#ff8888",
          }}
        >
          ВЫЙТИ ИЗ АККАУНТА
        </button>
      </div>
    </div>
  );
}
