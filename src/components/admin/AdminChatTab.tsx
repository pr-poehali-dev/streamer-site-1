import Icon from "@/components/ui/icon";
import { ChatMsg } from "./types";

interface AdminChatTabProps {
  chat: ChatMsg[];
  chatMsg: string;
  onChatMsgChange: (v: string) => void;
  onSendMsg: () => void;
  onHideMsg: (id: number) => void;
}

export default function AdminChatTab({
  chat,
  chatMsg,
  onChatMsgChange,
  onSendMsg,
  onHideMsg,
}: AdminChatTabProps) {
  return (
    <div>
      <div className="font-orbitron text-xs tracking-wider mb-4" style={{ color: "var(--neon-cyan)" }}>
        СООБЩЕНИЯ ЧАТА
      </div>
      {/* Send as streamer */}
      <div
        className="rounded-xl p-4 mb-4 flex gap-3"
        style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)" }}
      >
        <input
          value={chatMsg}
          onChange={(e) => onChatMsgChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendMsg()}
          placeholder="Написать от имени NEONKILL 👑..."
          className="flex-1 px-4 py-2.5 rounded-lg outline-none text-sm"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
        />
        <button
          onClick={onSendMsg}
          className="px-5 py-2.5 rounded-lg font-orbitron text-xs transition-all hover:scale-105 flex-shrink-0"
          style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", color: "var(--neon-purple)" }}
        >
          <Icon name="Send" size={15} />
        </button>
      </div>
      <div className="space-y-2">
        {chat.map((msg) => (
          <div
            key={msg.id}
            className="rounded-xl px-4 py-3 flex items-start gap-3 transition-all"
            style={{
              background: msg.is_hidden ? "rgba(255,0,0,0.03)" : "var(--card-bg)",
              border: `1px solid ${msg.is_hidden ? "rgba(255,0,0,0.15)" : "rgba(255,255,255,0.07)"}`,
              opacity: msg.is_hidden ? 0.5 : 1,
            }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: msg.color, boxShadow: `0 0 6px ${msg.color}` }} />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm mr-2" style={{ color: msg.color }}>{msg.user}</span>
              <span className="text-sm" style={{ color: msg.is_hidden ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)" }}>{msg.text}</span>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{msg.created_at}</div>
            </div>
            {!msg.is_hidden && (
              <button
                onClick={() => onHideMsg(msg.id)}
                className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:scale-110"
                style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.25)", color: "#ff6666" }}
                title="Скрыть сообщение"
              >
                <Icon name="EyeOff" size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
