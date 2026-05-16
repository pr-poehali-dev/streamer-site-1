import { useState } from "react";
import Icon from "@/components/ui/icon";
import HeroSection from "@/components/HeroSection";
import StreamsSection from "@/components/StreamsSection";
import AboutSection from "@/components/AboutSection";
import DonateSocialContacts from "@/components/DonateSocialContacts";
import AuthModal from "@/components/auth/AuthModal";
import UserProfileModal from "@/components/auth/UserProfileModal";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { id: "streams", label: "Трансляции" },
  { id: "about", label: "О стримере" },
  { id: "donate", label: "Донат" },
  { id: "social", label: "Соцсети" },
  { id: "contacts", label: "Контакты" },
];

export default function Index() {
  const { token, user, login, logout, updateUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [donateAmount, setDonateAmount] = useState(100);
  const [donateMessage, setDonateMessage] = useState("");
  const [donateName, setDonateName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full live-dot" style={{ background: "#ff0000" }} />
            <span className="text-xs font-orbitron text-red-400 tracking-wider">LIVE</span>
          </div>

          {/* Auth area */}
          {user ? (
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${user.color}50`,
              }}
            >
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-orbitron font-bold text-xs flex-shrink-0"
                style={{
                  background: user.avatar_url ? "transparent" : `${user.color}30`,
                  border: `1px solid ${user.color}`,
                  color: user.color,
                }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  user.username[0]?.toUpperCase()
                )}
              </div>
              <span
                className="font-orbitron font-bold text-xs hidden sm:inline max-w-[100px] truncate"
                style={{ color: user.color }}
              >
                {user.username}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-orbitron tracking-wider transition-all hover:scale-105"
              style={{
                background: "rgba(168,85,247,0.15)",
                border: "1px solid var(--neon-purple)",
                color: "var(--neon-purple)",
              }}
            >
              <Icon name="LogIn" size={13} />
              <span className="hidden sm:inline">ВОЙТИ</span>
            </button>
          )}

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
        <StreamsSection user={user} token={token} onOpenAuth={() => setAuthOpen(true)} />
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

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={login}
      />
      {user && token && (
        <UserProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          token={token}
          user={user}
          onUpdate={updateUser}
          onLogout={logout}
        />
      )}
    </div>
  );
}
