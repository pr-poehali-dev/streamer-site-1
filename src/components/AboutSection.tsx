const STREAMER_AVATAR = "https://cdn.poehali.dev/projects/21833572-8546-43e4-810e-2f0b177f98b9/files/3d57b0f3-c0f9-4fe9-8d49-760fd69c3326.jpg";

export default function AboutSection() {
  return (
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
  );
}
