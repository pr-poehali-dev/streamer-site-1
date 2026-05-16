import { useState } from "react";
import Icon from "@/components/ui/icon";
import HeroSection from "@/components/HeroSection";
import StreamsSection from "@/components/StreamsSection";
import AboutSection from "@/components/AboutSection";
import DonateSocialContacts from "@/components/DonateSocialContacts";

const CHAT_MESSAGES_INITIAL = [
  { id: 1, user: "KiraStar", color: "#a855f7", text: "Погнали! 🔥", time: "19:01" },
  { id: 2, user: "DarkFox88", color: "#00ffff", text: "Го стрим!", time: "19:02" },
  { id: 3, user: "NightOwl", color: "#00ff88", text: "Привет всем! Давно не заходил", time: "19:03" },
  { id: 4, user: "CyberWolf", color: "#ff00aa", text: "Топ стример 🎮", time: "19:04" },
  { id: 5, user: "xXShadow", color: "#a855f7", text: "Когда рейд?", time: "19:05" },
  { id: 6, user: "L1ghtning", color: "#00ffff", text: "Погнали мочить!", time: "19:06" },
];

const navItems = [
  { id: "streams", label: "Трансляции" },
  { id: "about", label: "О стримере" },
  { id: "donate", label: "Донат" },
  { id: "social", label: "Соцсети" },
  { id: "contacts", label: "Контакты" },
];

export default function Index() {
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES_INITIAL);
  const [chatInput, setChatInput] = useState("");
  const [chatUsername, setChatUsername] = useState("Гость");
  const [donateAmount, setDonateAmount] = useState(100);
  const [donateMessage, setDonateMessage] = useState("");
  const [donateName, setDonateName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <HeroSection scrollTo={scrollTo} />
        <StreamsSection
          chatMessages={chatMessages}
          chatInput={chatInput}
          chatUsername={chatUsername}
          setChatInput={setChatInput}
          setChatUsername={setChatUsername}
          sendMessage={sendMessage}
        />
        <AboutSection />
        <DonateSocialContacts
          donateAmount={donateAmount}
          donateMessage={donateMessage}
          donateName={donateName}
          setDonateAmount={setDonateAmount}
          setDonateMessage={setDonateMessage}
          setDonateName={setDonateName}
        />
      </div>
    </div>
  );
}
