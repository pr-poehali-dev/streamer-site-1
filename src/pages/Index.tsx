import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const STREAMER_AVATAR = "https://cdn.poehali.dev/projects/21833572-8546-43e4-810e-2f0b177f98b9/files/3d57b0f3-c0f9-4fe9-8d49-760fd69c3326.jpg";

const CHAT_MESSAGES_INITIAL = [
  { id: 1, user: "KiraStar", color: "#a855f7", text: "Погнали! 🔥", time: "19:01" },
  { id: 2, user: "DarkFox88", color: "#00ffff", text: "Го стрим!", time: "19:02" },
  { id: 3, user: "NightOwl", color: "#00ff88", text: "Привет всем! Давно не заходил", time: "19:03" },
  { id: 4, user: "CyberWolf", color: "#ff00aa", text: "Топ стример 🎮", time: "19:04" },
  { id: 5, user: "xXShadow", color: "#a855f7", text: "Когда рейд?", time: "19:05" },
  { id: 6, user: "L1ghtning", color: "#00ffff", text: "Погнали мочить!", time: "19:06" },
];

const SCHEDULE = [
  { day: "ПН", time: "20:00", game: "Valorant", live: false },
  { day: "СР", time: "19:00", game: "Cyberpunk 2077", live: false },
  { day: "ПТ", time: "21:00", game: "Escape from Tarkov", live: true },
  { day: "СБ", time: "18:00", game: "GTA VI", live: false },
  { day: "ВС", time: "20:00", game: "Apex Legends", live: false },
];

const SOCIALS = [
  { name: "Twitch", icon: "Tv", color: "#a855f7", handle: "@neonkill_live", url: "#" },
  { name: "YouTube", icon: "Youtube", color: "#ff0000", handle: "@NEONKILL", url: "#" },
  { name: "Telegram", icon: "Send", color: "#00ffff", handle: "t.me/neonkill", url: "#" },
  { name: "ВКонтакте", icon: "Users", color: "#00ff88", handle: "vk.com/neonkill", url: "#" },
  { name: "Discord", icon: "MessageSquare", color: "#5865F2", handle: "NEONKILL#0001", url: "#" },
];

const DONATE_AMOUNTS = [50, 100, 200, 500, 1000];

const STATS = [
  { label: "Подписчиков", value: "47.2K", color: "#a855f7" },
  { label: "Часов стримов", value: "2,340", color: "#00ffff" },
  { label: "Донатов", value: "12.8K", color: "#00ff88" },
  { label: "Место в топе", value: "#38", color: "#ff00aa" },
];

export default function Index() {
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES_INITIAL);
  const [chatInput, setChatInput] = useState("");
  const [chatUsername, setChatUsername] = useState("Гость");
  const [donateAmount, setDonateAmount] = useState(100);
  const [donateMessage, setDonateMessage] = useState("");
  const [donateName, setDonateName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const colors = ["#a855f7", "#00ffff", "#00ff88", "#ff00aa"];
    const newMsg = {
      id: chatMessages.length + 1,
      user: chatUsername || "Гость",
      color: colors[Math.floor(Math.random() * colors.length)],
      text: chatInput,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "streams", label: "Трансляции" },
    { id: "about", label: "О стримере" },
    { id: "donate", label: "Донат" },
    { id: "social", label: "Соцсети" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", color: "white" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #00ffff 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(7,7,17,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(168,85,247,0.2)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "rgba(168,85,247,0.2)", border: "1px solid var(--neon-purple)" }}>
            <span style={{ fontFamily: "Orbitron, monospace", color: "var(--neon-purple)", fontSize: "10px", fontWeight: 700 }}>NK</span>
          </div>
          <span className="font-orbitron font-bold text-sm tracking-widest" style={{ color: "var(--neon-purple)" }}>
            NEONKILL
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link">
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full live-dot" style={{ background: "#ff0000" }} />
            <span className="text-xs font-orbitron text-red-400 tracking-wider">LIVE</span>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "var(--neon-purple)" }}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed top-[65px] left-0 right-0 z-40 py-6 px-6"
          style={{ background: "rgba(7,7,17,0.97)", borderBottom: "1px solid rgba(168,85,247,0.3)" }}
        >
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link text-left text-base">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="px-3 py-1 rounded-full text-xs font-orbitron tracking-widest flex items-center gap-2"
                  style={{ background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.4)", color: "#ff6666" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: "#ff0000" }} />
                  В ЭФИРЕ СЕЙЧАС
                </div>
              </div>
              <h1 className="font-orbitron font-black leading-none mb-2" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
                <span className="gradient-text-purple-cyan">NEON</span>
              </h1>
              <h1
                className="font-orbitron font-black leading-none mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--neon-cyan)", textShadow: "0 0 30px var(--neon-cyan)" }}
              >
                KILL
              </h1>
              <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Стример · Киберспортсмен · Создатель контента
              </p>
              <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "440px" }}>
                Каждый вечер — живые трансляции шутеров и RPG. Заходи, чтобы стать частью команды.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollTo("streams")} className="btn-neon-purple px-8 py-3 rounded-lg text-sm font-semibold">
                  Смотреть стрим
                </button>
                <button onClick={() => scrollTo("donate")} className="btn-neon-cyan px-8 py-3 rounded-lg text-sm font-semibold">
                  Задонатить
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                {STATS.map((stat) => (
                  <div key={stat.label} className="card-game rounded-lg p-4 neon-border-purple">
                    <div className="font-orbitron font-bold text-xl" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center animate-slide-in-right">
              <div className="relative">
                <div
                  className="float-anim w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden relative"
                  style={{
                    border: "2px solid var(--neon-purple)",
                    boxShadow: "0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.2)",
                  }}
                >
                  <img src={STREAMER_AVATAR} alt="NEONKILL" className="w-full h-full object-cover" />
                  <div className="scanlines absolute inset-0" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan rounded-tl" style={{ borderColor: "var(--neon-cyan)" }} />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr" style={{ borderColor: "var(--neon-cyan)" }} />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl" style={{ borderColor: "var(--neon-cyan)" }} />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 rounded-br" style={{ borderColor: "var(--neon-cyan)" }} />
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-orbitron whitespace-nowrap"
                  style={{ background: "rgba(168,85,247,0.3)", border: "1px solid var(--neon-purple)", backdropFilter: "blur(10px)" }}
                >
                  🎮 Escape from Tarkov · 847 зрителей
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STREAMS */}
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

        {/* ABOUT */}
        <section id="about" className="py-24 px-6" style={{ background: "rgba(168,85,247,0.03)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title text-3xl md:text-4xl font-black mb-3 gradient-text-cyan-green">О стримере</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-orbitron tracking-wider mb-6"
                  style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "var(--neon-green)" }}
                >
                  LEVEL 99 STREAMER
                </div>
                <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.8)" }}>
                  Привет! Я — NEONKILL, стримлю уже 5 лет. Начинал с маленького канала, сейчас у нас большое сообщество геймеров.
                </p>
                <p className="leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Моя специализация — шутеры и хардкорные RPG. Играю честно, без читов, учу зрителей тактикам и разбираю матчи. Заходи — всегда рад новым союзникам!
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: "🎯", label: "Главный калибр", desc: "FPS & Battle Royal" },
                    { icon: "🏆", label: "Достижения", desc: "Топ-50 Valorant RU" },
                    { icon: "⚡", label: "Стиль", desc: "Агрессивная игра" },
                  ].map((item) => (
                    <div key={item.label} className="card-game rounded-xl p-4 text-center neon-border-green">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "var(--neon-green)" }}>{item.label}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div
                  className="rounded-2xl overflow-hidden relative"
                  style={{ border: "1px solid rgba(0,255,136,0.3)", boxShadow: "0 0 40px rgba(0,255,136,0.1)" }}
                >
                  <img src={STREAMER_AVATAR} alt="NEONKILL" className="w-full object-cover" style={{ height: "380px" }} />
                  <div className="scanlines absolute inset-0" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,17,0.8) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="font-orbitron font-bold text-xl" style={{ color: "var(--neon-green)" }}>NEONKILL</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Профессиональный стример</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DONATE */}
        <section id="donate" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title text-3xl md:text-4xl font-black mb-3 gradient-text-purple-cyan">Поддержать стримера</h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Донат помогает создавать лучший контент</p>
            </div>

            <div
              className="rounded-2xl p-8 md:p-10"
              style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 40px rgba(168,85,247,0.1)" }}
            >
              <div className="mb-8">
                <div className="text-xs font-orbitron tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>ПОСЛЕДНИЕ ДОНАТЫ</div>
                <div className="space-y-2">
                  {[
                    { name: "DarkKnight", amount: 500, msg: "За топовый хедшот! 🎯" },
                    { name: "CyberCat", amount: 200, msg: "Спасибо за стрим!" },
                    { name: "NightRider", amount: 1000, msg: "Ты лучший!" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg" style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.15)" }}>
                      <div className="font-orbitron font-bold text-sm" style={{ color: "var(--neon-green)" }}>+{d.amount}₽</div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm" style={{ color: "var(--neon-cyan)" }}>{d.name}: </span>
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{d.msg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-orbitron tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>СУММА ДОНАТА (₽)</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {DONATE_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDonateAmount(amt)}
                      className="px-4 py-2 rounded-lg font-orbitron text-sm transition-all"
                      style={{
                        background: donateAmount === amt ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${donateAmount === amt ? "var(--neon-purple)" : "rgba(255,255,255,0.1)"}`,
                        color: donateAmount === amt ? "var(--neon-purple)" : "rgba(255,255,255,0.6)",
                        boxShadow: donateAmount === amt ? "0 0 15px rgba(168,85,247,0.3)" : "none",
                      }}
                    >
                      {amt}₽
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                  placeholder="Или введи свою сумму..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs font-orbitron tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>ИМЯ</div>
                  <input
                    value={donateName}
                    onChange={(e) => setDonateName(e.target.value)}
                    placeholder="Как тебя зовут?"
                    className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                  />
                </div>
                <div>
                  <div className="text-xs font-orbitron tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>СООБЩЕНИЕ</div>
                  <input
                    value={donateMessage}
                    onChange={(e) => setDonateMessage(e.target.value)}
                    placeholder="Оставь сообщение..."
                    className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                  />
                </div>
              </div>

              <button
                className="w-full py-4 rounded-xl font-orbitron font-bold tracking-widest text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(0,255,255,0.2))",
                  border: "1px solid var(--neon-purple)",
                  color: "white",
                  boxShadow: "0 0 30px rgba(168,85,247,0.3)",
                }}
              >
                💜 ПОДДЕРЖАТЬ НА {donateAmount}₽
              </button>
            </div>
          </div>
        </section>

        {/* SOCIALS */}
        <section id="social" className="py-24 px-6" style={{ background: "rgba(0,255,255,0.02)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title text-3xl md:text-4xl font-black mb-3 gradient-text-cyan-green">Социальные сети</h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Подписывайся, чтобы не пропустить эфиры</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  className="card-game rounded-2xl p-6 block group transition-all"
                  style={{ border: `1px solid ${s.color}30`, background: `linear-gradient(135deg, ${s.color}08, transparent)` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                    style={{ background: `${s.color}20`, border: `1px solid ${s.color}50` }}
                  >
                    <Icon name={s.icon} size={22} style={{ color: s.color }} />
                  </div>
                  <div className="font-orbitron font-bold mb-1" style={{ color: "white" }}>{s.name}</div>
                  <div className="text-sm" style={{ color: s.color }}>{s.handle}</div>
                  <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Перейти <Icon name="ArrowRight" size={12} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTS */}
        <section id="contacts" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title text-3xl md:text-4xl font-black mb-3 gradient-text-purple-cyan">Контакты</h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>По вопросам сотрудничества и рекламы</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                { icon: "Mail", label: "Email для сотрудничества", value: "neonkill@gmail.com", color: "var(--neon-purple)" },
                { icon: "Send", label: "Telegram (быстрее всего)", value: "@neonkill_live", color: "var(--neon-cyan)" },
              ].map((c, i) => (
                <div key={i} className="card-game rounded-2xl p-6 neon-border-purple">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${c.color}15`, border: `1px solid ${c.color}40` }}>
                    <Icon name={c.icon} size={18} style={{ color: c.color }} />
                  </div>
                  <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{c.label}</div>
                  <div className="font-semibold" style={{ color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-8" style={{ background: "var(--card-bg)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <div className="text-sm font-orbitron tracking-wider mb-6" style={{ color: "var(--neon-purple)" }}>НАПИСАТЬ НАПРЯМУЮ</div>
              <div className="space-y-4">
                <input
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
                <input
                  placeholder="Email или Telegram"
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
                <textarea
                  rows={4}
                  placeholder="Опишите ваш запрос..."
                  className="w-full px-4 py-3 rounded-lg outline-none text-sm resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                />
                <button
                  className="w-full py-4 rounded-xl font-orbitron font-bold tracking-widest text-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,255,255,0.15))",
                    border: "1px solid var(--neon-purple)",
                    color: "var(--neon-purple)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.2)",
                  }}
                >
                  ОТПРАВИТЬ СООБЩЕНИЕ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="py-8 px-6 text-center"
          style={{ borderTop: "1px solid rgba(168,85,247,0.2)", background: "rgba(7,7,17,0.8)" }}
        >
          <div className="font-orbitron font-bold tracking-widest mb-2" style={{ color: "var(--neon-purple)" }}>NEONKILL</div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2024 NEONKILL · Все права защищены · Создано с 💜</p>
        </footer>
      </div>
    </div>
  );
}