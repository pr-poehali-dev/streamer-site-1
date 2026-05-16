import { useState } from "react";
import Icon from "@/components/ui/icon";
import { StreamStatus } from "./types";

interface AdminStreamTabProps {
  stream: StreamStatus;
  saving: boolean;
  onToggle: () => void;
  onStreamChange: (s: StreamStatus) => void;
  onSave: () => void;
  onRegenerateKey: () => void;
}

function formatTimeLeft(expiresAt: string): string {
  if (!expiresAt) return "";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "обновляется...";
  const totalHours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}д ${hours}ч`;
  return `${hours}ч`;
}

export default function AdminStreamTab({
  stream,
  saving,
  onToggle,
  onStreamChange,
  onSave,
  onRegenerateKey,
}: AdminStreamTabProps) {
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeLeft = formatTimeLeft(stream.key_expires_at);

  const copyKey = () => {
    navigator.clipboard.writeText(stream.stream_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl font-orbitron font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", color: "var(--neon-purple)" }}
        >
          {saving ? "СОХРАНЯЕМ..." : "СОХРАНИТЬ"}
        </button>
      </div>

      {/* Stream Key */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--card-bg)", border: "1px solid rgba(0,255,136,0.25)" }}
      >
        <div className="flex items-center justify-between">
          <div className="font-orbitron text-xs tracking-wider" style={{ color: "var(--neon-green)" }}>
            STREAM KEY
          </div>
          {timeLeft && (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-orbitron"
              style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", color: "var(--neon-green)" }}
            >
              <Icon name="Clock" size={11} />
              смена через {timeLeft}
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Используй в OBS: Настройки → Трансляция → Ключ потока. Ключ автоматически меняется каждые 2 дня.
        </p>

        {/* Key display */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,136,0.2)" }}
        >
          <span className="flex-1 tracking-widest" style={{ color: keyVisible ? "var(--neon-green)" : "rgba(255,255,255,0.2)", letterSpacing: keyVisible ? "0.15em" : "0.4em" }}>
            {keyVisible ? stream.stream_key : "•".repeat(25)}
          </span>
          <button
            onClick={() => setKeyVisible(!keyVisible)}
            className="p-1.5 rounded transition-all hover:scale-110 flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.4)" }}
            title={keyVisible ? "Скрыть" : "Показать"}
          >
            <Icon name={keyVisible ? "EyeOff" : "Eye"} size={14} />
          </button>
          <button
            onClick={copyKey}
            className="p-1.5 rounded transition-all hover:scale-110 flex-shrink-0"
            style={{ color: copied ? "var(--neon-green)" : "rgba(255,255,255,0.4)" }}
            title="Копировать"
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} />
          </button>
        </div>

        {/* Regenerate */}
        <button
          onClick={onRegenerateKey}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron text-xs transition-all hover:scale-105"
          style={{
            background: "rgba(255,165,0,0.1)",
            border: "1px solid rgba(255,165,0,0.4)",
            color: "#ffa500",
          }}
        >
          <Icon name="RefreshCw" size={13} />
          СГЕНЕРИРОВАТЬ НОВЫЙ КЛЮЧ
        </button>
      </div>
    </div>
  );
}
