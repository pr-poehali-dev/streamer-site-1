import Icon from "@/components/ui/icon";

const STREAMER_AVATAR = "https://cdn.poehali.dev/projects/21833572-8546-43e4-810e-2f0b177f98b9/files/3d57b0f3-c0f9-4fe9-8d49-760fd69c3326.jpg";

const STATS = [
  { label: "Подписчиков", value: "47.2K", color: "#a855f7" },
  { label: "Часов стримов", value: "2,340", color: "#00ffff" },
  { label: "Донатов", value: "12.8K", color: "#00ff88" },
  { label: "Место в топе", value: "#38", color: "#ff00aa" },
];

interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export default function HeroSection({ scrollTo }: HeroSectionProps) {
  return (
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
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl" style={{ borderColor: "var(--neon-cyan)" }} />
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
  );
}
