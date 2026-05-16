import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SCHEDULE = [
  { day: "ПН", time: "20:00", game: "Valorant", live: false },
  { day: "СР", time: "19:00", game: "Cyberpunk 2077", live: false },
  { day: "ПТ", time: "21:00", game: "Escape from Tarkov", live: true },
  { day: "СБ", time: "18:00", game: "GTA VI", live: false },
  { day: "ВС", time: "20:00", game: "Apex Legends", live: false },
];

interface ChatMessage {
  id: number;
  user: string;
  color: string;
  text: string;
  time: string;
}

interface StreamsSectionProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  chatUsername: string;
  setChatInput: (v: string) => void;
  setChatUsername: (v: string) => void;
  sendMessage: () => void;
}

export default function StreamsSection({
  chatMessages,
  chatInput,
  chatUsername,
  setChatInput,
  setChatUsername,
  sendMessage,
}: StreamsSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <section id="streams" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title text-3xl md:text-4xl font-black mb-3 gradient-text-purple-cyan">Расписание трансляций</h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Подключайся в нужное время</p>
        </div>

        <div className="grid gap-4 mb-12">
          {SCHEDULE.map((item, i) => (
            <div
              key={i}
              className="card-game rounded-xl p-5 flex items-center gap-6"
              style={{
                border: item.live ? "1px solid rgba(255,0,0,0.5)" : "1px solid var(--card-border)",
                boxShadow: item.live ? "0 0 20px rgba(255,0,0,0.15)" : "none",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center font-orbitron font-bold text-sm flex-shrink-0"
                style={{
                  background: item.live ? "rgba(255,0,0,0.2)" : "rgba(168,85,247,0.1)",
                  border: `1px solid ${item.live ? "rgba(255,0,0,0.5)" : "rgba(168,85,247,0.3)"}`,
                  color: item.live ? "#ff6666" : "var(--neon-purple)",
                }}
              >
                {item.day}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base" style={{ color: "white" }}>{item.game}</div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{item.time} МСК</div>
              </div>
              {item.live ? (
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-orbitron flex items-center gap-2"
                  style={{ background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,0,0,0.5)", color: "#ff6666" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: "#ff0000" }} />
                  LIVE
                </div>
              ) : (
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-orbitron"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
                >
                  СКОРО
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Stream placeholder */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col items-center justify-center relative"
            style={{ aspectRatio: "16/9", background: "rgba(13,13,26,0.8)", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(0,255,255,0.05) 100%)" }} />
            <div className="scanlines absolute inset-0" />
            <div className="relative z-10 text-center px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(168,85,247,0.2)", border: "1px solid var(--neon-purple)" }}
              >
                <Icon name="Tv" size={28} style={{ color: "var(--neon-purple)" }} />
              </div>
              <p className="font-orbitron text-sm tracking-wider mb-2" style={{ color: "var(--neon-purple)" }}>ПРЯМОЙ ЭФИР</p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Escape from Tarkov · 847 зрителей</p>
              <button className="btn-neon-purple px-6 py-2 rounded-lg text-xs">Смотреть на Twitch</button>
            </div>
          </div>

          {/* CHAT */}
          <div
            className="rounded-2xl flex flex-col overflow-hidden"
            style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)", height: "400px" }}
          >
            <div
              className="px-5 py-3 flex items-center gap-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.05)" }}
            >
              <Icon name="MessageSquare" size={16} style={{ color: "var(--neon-purple)" }} />
              <span className="font-orbitron text-xs tracking-wider" style={{ color: "var(--neon-purple)" }}>ЧАТ</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>847 онлайн</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-message text-sm">
                  <span className="text-xs mr-2" style={{ color: "rgba(255,255,255,0.3)" }}>{msg.time}</span>
                  <span className="font-semibold mr-1.5" style={{ color: msg.color }}>{msg.user}:</span>
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="flex gap-2 mb-2">
                <input
                  value={chatUsername}
                  onChange={(e) => setChatUsername(e.target.value)}
                  placeholder="Твой ник"
                  className="flex-1 px-3 py-1.5 rounded text-xs outline-none"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Написать в чат..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", color: "var(--neon-purple)" }}
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
