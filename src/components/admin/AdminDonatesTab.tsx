import { Donate } from "./types";

interface AdminDonatesTabProps {
  donates: Donate[];
  unread: number;
  onMarkRead: (id: number) => void;
}

export default function AdminDonatesTab({ donates, unread, onMarkRead }: AdminDonatesTabProps) {
  return (
    <div className="space-y-3">
      <div className="font-orbitron text-xs tracking-wider mb-4" style={{ color: "var(--neon-green)" }}>
        ДОНАТЫ · {unread} новых
      </div>
      {donates.length === 0 && (
        <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.3)" }}>Донатов пока нет</div>
      )}
      {donates.map((d) => (
        <div
          key={d.id}
          className="rounded-xl p-4 flex items-start gap-4 transition-all"
          style={{
            background: d.is_read ? "rgba(13,13,26,0.5)" : "rgba(0,255,136,0.05)",
            border: `1px solid ${d.is_read ? "rgba(255,255,255,0.08)" : "rgba(0,255,136,0.3)"}`,
          }}
        >
          <div
            className="font-orbitron font-bold text-lg flex-shrink-0 w-20 text-right"
            style={{ color: d.is_read ? "rgba(255,255,255,0.4)" : "var(--neon-green)" }}
          >
            +{d.amount}₽
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold mb-0.5" style={{ color: d.is_read ? "rgba(255,255,255,0.5)" : "var(--neon-cyan)" }}>{d.name}</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{d.msg}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{d.created_at}</div>
          </div>
          {!d.is_read && (
            <button
              onClick={() => onMarkRead(d.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
              style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", color: "var(--neon-green)" }}
            >
              ✓ ПРОЧИТ.
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
