import { useState, useEffect } from "react";
import { api, Tab, StreamStatus, ScheduleRow, Donate, ChatMsg } from "@/components/admin/types";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStreamTab from "@/components/admin/AdminStreamTab";
import AdminScheduleTab from "@/components/admin/AdminScheduleTab";
import AdminDonatesTab from "@/components/admin/AdminDonatesTab";
import AdminChatTab from "@/components/admin/AdminChatTab";

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

  if (!token) return <AdminLogin onLogin={setToken} />;

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

  const unread = donates.filter((d) => !d.is_read).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", color: "white" }}>
      <AdminHeader
        isLive={stream.is_live}
        loading={loading}
        unread={unread}
        tab={tab}
        onRefresh={loadData}
        onLogout={logout}
        onTabChange={setTab}
      />

      <div className="max-w-4xl mx-auto px-4 pb-10">
        {tab === "stream" && (
          <AdminStreamTab
            stream={stream}
            saving={saving}
            onToggle={toggleStream}
            onStreamChange={setStream}
            onSave={saveStream}
          />
        )}
        {tab === "schedule" && (
          <AdminScheduleTab
            schedule={schedule}
            onAdd={addScheduleRow}
            onSaveRow={saveScheduleRow}
            onDeleteRow={deleteScheduleRow}
          />
        )}
        {tab === "donates" && (
          <AdminDonatesTab
            donates={donates}
            unread={unread}
            onMarkRead={markDonateRead}
          />
        )}
        {tab === "chat" && (
          <AdminChatTab
            chat={chat}
            chatMsg={chatMsg}
            onChatMsgChange={setChatMsg}
            onSendMsg={sendChatMsg}
            onHideMsg={hideChat}
          />
        )}
      </div>
    </div>
  );
}
