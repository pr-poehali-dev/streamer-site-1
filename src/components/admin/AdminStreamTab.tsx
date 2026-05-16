import { StreamStatus } from "./types";

interface AdminStreamTabProps {
  stream: StreamStatus;
  saving: boolean;
  onToggle: () => void;
  onStreamChange: (s: StreamStatus) => void;
  onSave: () => void;
}

export default function AdminStreamTab({
  stream,
  saving,
  onToggle,
  onStreamChange,
  onSave,
}: AdminStreamTabProps) {
  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: "var(--card-bg)", border: `1px solid ${stream.is_live ? "rgba(255,0,0,0.4)" : "rgba(168,85,247,0.3)"}` }}
      >
        <div>
          <div className="font-orbitron font-bold mb-1" style={{ color: stream.is_live ? "#ff6666" : "white" }}>
            {stream.is_live ? "🔴 СТРИМ ИДЁТ" : "⚫ СТРИМ ОСТАНОВЛЕН"}
          </div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            {stream.is_live ? `${stream.game} · Зрители: ${stream.viewers}` : "Нажми кнопку, чтобы начать"}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="px-8 py-3 rounded-xl font-orbitron font-bold text-sm transition-all hover:scale-105"
          style={stream.is_live ? {
            background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,0,0,0.5)", color: "#ff6666"
          } : {
            background: "linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,255,136,0.1))",
            border: "1px solid var(--neon-green)", color: "var(--neon-green)"
          }}
        >
          {stream.is_live ? "⏹ ОСТАНОВИТЬ" : "▶ ЗАПУСТИТЬ СТРИМ"}
        </button>
      </div>

      {/* Stream info */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)" }}>
        <div className="font-orbitron text-xs tracking-wider mb-4" style={{ color: "var(--neon-purple)" }}>НАСТРОЙКИ ТРАНСЛЯЦИИ</div>
        <div>
          <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>НАЗВАНИЕ СТРИМА</div>
          <input
            value={stream.title}
            onChange={(e) => onStreamChange({ ...stream, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg outline-none text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
          />
        </div>
        <div>
          <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>ИГРА</div>
          <input
            value={stream.game}
            onChange={(e) => onStreamChange({ ...stream, game: e.target.value })}
            className="w-full px-4 py-3 rounded-lg outline-none text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
          />
        </div>
        <div>
          <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>STREAM KEY (для OBS / внешних инструментов)</div>
          <input
            value={stream.stream_key}
            onChange={(e) => onStreamChange({ ...stream, stream_key: e.target.value })}
            type="password"
            placeholder="sk_live_..."
            className="w-full px-4 py-3 rounded-lg outline-none text-sm font-mono"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
          />
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl font-orbitron font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", color: "var(--neon-purple)" }}
        >
          {saving ? "СОХРАНЯЕМ..." : "СОХРАНИТЬ"}
        </button>
      </div>
    </div>
  );
}
