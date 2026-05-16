import Icon from "@/components/ui/icon";
import { Tab } from "./types";

interface AdminHeaderProps {
  isLive: boolean;
  loading: boolean;
  unread: number;
  tab: Tab;
  onRefresh: () => void;
  onLogout: () => void;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "stream", label: "Стрим", icon: "Tv" },
  { id: "schedule", label: "Расписание", icon: "Calendar" },
  { id: "donates", label: "Донаты", icon: "Heart" },
  { id: "chat", label: "Чат", icon: "MessageSquare" },
];

export default function AdminHeader({
  isLive,
  loading,
  unread,
  tab,
  onRefresh,
  onLogout,
  onTabChange,
}: AdminHeaderProps) {
  return (
    <>
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(7,7,17,0.95)", borderBottom: "1px solid rgba(168,85,247,0.2)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "rgba(168,85,247,0.2)", border: "1px solid var(--neon-purple)" }}>
            <Icon name="Shield" size={14} style={{ color: "var(--neon-purple)" }} />
          </div>
          <div>
            <div className="font-orbitron font-bold text-sm" style={{ color: "var(--neon-purple)" }}>ADMIN PANEL</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>NEONKILL</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: isLive ? "#ff0000" : "#555",
                boxShadow: isLive ? "0 0 8px #ff0000" : "none",
              }}
            />
            <span className="text-xs font-orbitron" style={{ color: isLive ? "#ff6666" : "rgba(255,255,255,0.4)" }}>
              {isLive ? "LIVE" : "ОФЛАЙН"}
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
          >
            <Icon name={loading ? "Loader" : "RefreshCw"} size={15} />
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
            style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff6666" }}
          >
            ВЫЙТИ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-orbitron whitespace-nowrap transition-all relative"
              style={{
                background: tab === t.id ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tab === t.id ? "var(--neon-purple)" : "rgba(255,255,255,0.1)"}`,
                color: tab === t.id ? "var(--neon-purple)" : "rgba(255,255,255,0.5)",
                boxShadow: tab === t.id ? "0 0 15px rgba(168,85,247,0.2)" : "none",
              }}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {t.id === "donates" && unread > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: "#ff0000", color: "white", fontSize: "10px" }}
                >
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
