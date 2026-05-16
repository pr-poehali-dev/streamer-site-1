import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ScheduleRow } from "./types";

interface AdminScheduleTabProps {
  schedule: ScheduleRow[];
  onAdd: () => void;
  onSaveRow: (row: ScheduleRow) => void;
  onDeleteRow: (id: number) => void;
}

export default function AdminScheduleTab({
  schedule,
  onAdd,
  onSaveRow,
  onDeleteRow,
}: AdminScheduleTabProps) {
  const [editRow, setEditRow] = useState<ScheduleRow | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-orbitron text-xs tracking-wider" style={{ color: "var(--neon-cyan)" }}>РАСПИСАНИЕ ТРАНСЛЯЦИЙ</div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
          style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.4)", color: "var(--neon-cyan)" }}
        >
          <Icon name="Plus" size={13} /> ДОБАВИТЬ
        </button>
      </div>
      {schedule.map((row) => (
        <div
          key={row.id}
          className="rounded-xl p-4"
          style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.2)" }}
        >
          {editRow?.id === row.id ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>ДЕНЬ</div>
                <input
                  value={editRow.day}
                  onChange={(e) => setEditRow({ ...editRow, day: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>ВРЕМЯ МСК</div>
                <input
                  value={editRow.time}
                  onChange={(e) => setEditRow({ ...editRow, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>ИГРА</div>
                <input
                  value={editRow.game}
                  onChange={(e) => setEditRow({ ...editRow, game: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onSaveRow(editRow); setEditRow(null); }}
                  className="flex-1 py-2 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
                  style={{ background: "rgba(0,255,136,0.2)", border: "1px solid var(--neon-green)", color: "var(--neon-green)" }}
                >
                  ОК
                </button>
                <button
                  onClick={() => setEditRow(null)}
                  className="px-3 py-2 rounded-lg text-xs transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-orbitron font-bold text-sm flex-shrink-0"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: row.is_active ? "var(--neon-purple)" : "rgba(255,255,255,0.3)" }}
              >
                {row.day}
              </div>
              <div className="flex-1">
                <div className="font-semibold" style={{ color: row.is_active ? "white" : "rgba(255,255,255,0.4)" }}>{row.game}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{row.time} МСК</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditRow(row)}
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
                >
                  <Icon name="Pencil" size={13} />
                </button>
                <button
                  onClick={() => onDeleteRow(row.id)}
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff6666" }}
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
