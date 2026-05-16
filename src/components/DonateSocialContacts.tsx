import Icon from "@/components/ui/icon";

const SOCIALS = [
  { name: "Twitch", icon: "Tv", color: "#a855f7", handle: "@neonkill_live", url: "#" },
  { name: "YouTube", icon: "Youtube", color: "#ff0000", handle: "@NEONKILL", url: "#" },
  { name: "Telegram", icon: "Send", color: "#00ffff", handle: "t.me/neonkill", url: "#" },
  { name: "ВКонтакте", icon: "Users", color: "#00ff88", handle: "vk.com/neonkill", url: "#" },
  { name: "Discord", icon: "MessageSquare", color: "#5865F2", handle: "NEONKILL#0001", url: "#" },
];

const DONATE_AMOUNTS = [50, 100, 200, 500, 1000];

interface DonateSocialContactsProps {
  donateAmount: number;
  donateMessage: string;
  donateName: string;
  setDonateAmount: (v: number) => void;
  setDonateMessage: (v: string) => void;
  setDonateName: (v: string) => void;
}

export default function DonateSocialContacts({
  donateAmount,
  donateMessage,
  donateName,
  setDonateAmount,
  setDonateMessage,
  setDonateName,
}: DonateSocialContactsProps) {
  return (
    <>
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
    </>
  );
}
