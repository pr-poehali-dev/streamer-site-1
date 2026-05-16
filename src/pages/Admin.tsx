import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/19344b39-39c2-40ec-a9b5-ada84b47a266";

type Tab = "stream" | "schedule" | "donates" | "chat";

interface StreamStatus {
  is_live: boolean;
  title: string;
  game: string;
  viewers: number;
  stream_key: string;
}
interface ScheduleRow {
  id: number;
  day: string;
  time: string;
  game: string;
  is_active: boolean;
}
interface Donate {
  id: number;
  name: string;
  amount: number;
  msg: string;
  is_read: boolean;
  created_at: string;
}
interface ChatMsg {
  id: number;
  user: string;
  color: string;
  text: string;
  is_hidden: boolean;
  created_at: string;
}

function api(action: string, token: string, extra: object = {}) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ action, ...extra }),
  }).then((r) => r.json());
}

// ── Login screen ──────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
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

// ── Main dashboard ─────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [tab, setTab] = useState<Tab>("stream");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stream, setStream] = useState<StreamStatus>({ is_live: false, title: "", game: "", viewers: 0, stream_key: "" });
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [donates, setDonates] = useState<Donate[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatMsg, setChatMsg] = useState("");

  // schedule edit state
  const [editRow, setEditRow] = useState<ScheduleRow | null>(null);

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await api("get_data", token);
    setLoading(false);
    if (res.ok) {
      setStream(res.stream);
      setSchedule(res.schedule);
      setDonates(res.donates);
      setChat(res.chat);
    } else if (res.error === "Нет доступа") {
      logout();
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  if (!token) return <LoginScreen onLogin={setToken} />;

  const toggleStream = async () => {
    const res = await api("toggle_stream", token);
    if (res.ok) setStream((s) => ({ ...s, is_live: res.is_live }));
  };

  const saveStream = async () => {
    setSaving(true);
    await api("update_stream", token, { title: stream.title, game: stream.game, stream_key: stream.stream_key });
    setSaving(false);
  };

  const saveScheduleRow = async (row: ScheduleRow) => {
    await api("update_schedule", token, { id: row.id, day: row.day, time: row.time, game: row.game, is_active: row.is_active });
    setEditRow(null);
    loadData();
  };

  const deleteScheduleRow = async (id: number) => {
    await api("delete_schedule", token, { id });
    loadData();
  };

  const addScheduleRow = async () => {
    await api("update_schedule", token, { day: "ПН", time: "20:00", game: "Новая игра", is_active: true });
    loadData();
  };

  const markDonateRead = async (id: number) => {
    await api("mark_donate_read", token, { id });
    setDonates((d) => d.map((x) => (x.id === id ? { ...x, is_read: true } : x)));
  };

  const hideChat = async (id: number) => {
    await api("hide_chat_message", token, { id });
    setChat((c) => c.map((x) => (x.id === id ? { ...x, is_hidden: true } : x)));
  };

  const sendChatMsg = async () => {
    if (!chatMsg.trim()) return;
    await api("send_chat_message", token, { text: chatMsg });
    setChatMsg("");
    loadData();
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "stream", label: "Стрим", icon: "Tv" },
    { id: "schedule", label: "Расписание", icon: "Calendar" },
    { id: "donates", label: "Донаты", icon: "Heart" },
    { id: "chat", label: "Чат", icon: "MessageSquare" },
  ];

  const unread = donates.filter((d) => !d.is_read).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", color: "white" }}>
      {/* Header */}
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
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: stream.is_live ? "#ff0000" : "#555",
                boxShadow: stream.is_live ? "0 0 8px #ff0000" : "none",
              }}
            />
            <span className="text-xs font-orbitron" style={{ color: stream.is_live ? "#ff6666" : "rgba(255,255,255,0.4)" }}>
              {stream.is_live ? "LIVE" : "ОФЛАЙН"}
            </span>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
          >
            <Icon name={loading ? "Loader" : "RefreshCw"} size={15} />
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
            style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff6666" }}
          >
            ВЫЙТИ
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

        {/* ── TAB: STREAM ── */}
        {tab === "stream" && (
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
                onClick={toggleStream}
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
                  onChange={(e) => setStream((s) => ({ ...s, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>ИГРА</div>
                <input
                  value={stream.game}
                  onChange={(e) => setStream((s) => ({ ...s, game: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <div>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>STREAM KEY (для OBS / внешних инструментов)</div>
                <input
                  value={stream.stream_key}
                  onChange={(e) => setStream((s) => ({ ...s, stream_key: e.target.value }))}
                  type="password"
                  placeholder="sk_live_..."
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm font-mono"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
              </div>
              <button
                onClick={saveStream}
                disabled={saving}
                className="px-6 py-3 rounded-xl font-orbitron font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", color: "var(--neon-purple)" }}
              >
                {saving ? "СОХРАНЯЕМ..." : "СОХРАНИТЬ"}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: SCHEDULE ── */}
        {tab === "schedule" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-orbitron text-xs tracking-wider" style={{ color: "var(--neon-cyan)" }}>РАСПИСАНИЕ ТРАНСЛЯЦИЙ</div>
              <button
                onClick={addScheduleRow}
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
                        onClick={() => saveScheduleRow(editRow)}
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
                        onClick={() => deleteScheduleRow(row.id)}
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
        )}

        {/* ── TAB: DONATES ── */}
        {tab === "donates" && (
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
                    onClick={() => markDonateRead(d.id)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all hover:scale-105"
                    style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", color: "var(--neon-green)" }}
                  >
                    ✓ ПРОЧИТ.
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: CHAT ── */}
        {tab === "chat" && (
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
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMsg()}
                placeholder="Написать от имени NEONKILL 👑..."
                className="flex-1 px-4 py-2.5 rounded-lg outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
              />
              <button
                onClick={sendChatMsg}
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
                      onClick={() => hideChat(msg.id)}
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
        )}
      </div>
    </div>
  );
}
