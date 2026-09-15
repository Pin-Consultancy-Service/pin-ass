"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, GraduationCap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

/* ─── Types ──────────────────────────────────────────── */
type Role = "bot" | "user";

interface Message {
  id: number;
  role: Role;
  text: string;
}

/* ─── Bot knowledge base ─────────────────────────────── */
const BOT_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "start"],
    answer:
      "Hello! 👋 Welcome to PIN Consultancy Services. I'm here to help you with information about our programmes, fees, and registration.\n\nWhat would you like to know?",
  },
  {
    keywords: ["ican", "chartered accountant", "aca", "fca"],
    answer:
      "We offer comprehensive **ICAN tuition** across all three levels:\n\n• Foundation Level — ₦85,000/diet\n• Skills Level — ₦95,000/diet\n• Professional Level — ₦110,000/diet\n\nClasses run weekday, weekend, and online. Would you like to apply?",
  },
  {
    keywords: ["acca", "association", "global", "international"],
    answer:
      "Our **ACCA programme** covers all levels — Applied Knowledge, Applied Skills, and Strategic Professional.\n\nFees start from ₦95,000 per sitting. ACCA is recognised in 180+ countries. Ready to enrol?",
  },
  {
    keywords: ["citn", "tax", "taxation", "cit"],
    answer:
      "The **CITN qualification** is Nigeria's premier tax credential. We offer Qualifying and Professional level tuition from ₦90,000/diet.\n\nOur tutors are active tax practitioners.",
  },
  {
    keywords: ["ats", "technician", "foundation", "entry"],
    answer:
      "**ATS (Accounting Technicians Scheme)** is the perfect entry point into professional accounting — ideal for OND holders and school leavers.\n\nFees: ₦65,000 per level across three levels.",
  },
  {
    keywords: ["cisa", "it audit", "isaca", "information system"],
    answer:
      "Our **CISA programme** prepares IT audit and information security professionals for ISACA certification.\n\nFees: ₦120,000. Weekend and online classes available.",
  },
  {
    keywords: ["ifrs", "diploma", "international financial reporting"],
    answer:
      "The **Diploma in IFRS** is ACCA-accredited and designed for accountants needing IFRS expertise.\n\n• Certificate in IFRS — ₦80,000\n• Diploma in IFRS — ₦120,000\n\nWeekend and online classes available.",
  },
  {
    keywords: ["fee", "price", "cost", "how much", "fees"],
    answer:
      "Our tuition fees vary by programme:\n\n• ICAN: ₦85,000–₦110,000/diet\n• ACCA: ₦95,000–₦115,000/sitting\n• CITN: ₦90,000–₦100,000/diet\n• ATS: ₦65,000/level\n• CISA: ₦120,000\n• Diploma IFRS: ₦80,000–₦120,000\n\nPayment plans are available. Shall I help you apply?",
  },
  {
    keywords: ["register", "apply", "enrol", "enroll", "sign up", "registration"],
    answer:
      "To register, you can:\n\n1. Visit our **Apply Now** page on the website\n2. Fill in the application form\n3. Our admissions team will contact you within 1 business day\n\nWould you like to speak directly with our team on WhatsApp?",
  },
  {
    keywords: ["online", "virtual", "remote", "class", "mode"],
    answer:
      "Yes! We offer **flexible study modes**:\n\n• Weekday morning classes\n• Weekday evening classes\n• Weekend intensives\n• Fully online live classes\n\nAll students get access to recorded sessions and our digital study portal.",
  },
  {
    keywords: ["contact", "phone", "call", "email", "address", "location", "office"],
    answer:
      "You can reach us at:\n\n📍 12 Professional Drive, Victoria Island, Lagos\n📞 +234 800 000 0000\n📧 info@pinassociates.com.ng\n🕐 Mon–Fri: 8am–6pm | Sat: 9am–3pm\n\nOr chat with us directly on WhatsApp!",
  },
  {
    keywords: ["pass rate", "success", "result", "how good", "track record"],
    answer:
      "We're proud of our results:\n\n🏆 **87% first-attempt pass rate** across all programmes\n👩‍🎓 5,000+ graduates since 2009\n📚 9 professional programmes\n👨‍🏫 15+ expert tutors\n\nOur students work at EY, KPMG, Deloitte, GTBank, and more.",
  },
  {
    keywords: ["corporate", "company", "organisation", "business", "team training"],
    answer:
      "We provide **Corporate Training & Advisory** services including:\n\n• Workforce development\n• Tax advisory\n• Financial consulting\n• Regulatory compliance workshops\n\nContact us for a tailored corporate proposal.",
  },
  {
    keywords: ["whatsapp", "chat", "speak", "talk", "human", "agent", "person"],
    answer:
      "Of course! Our admissions team is available on WhatsApp during business hours.\n\nClick the button below to continue our conversation there 👇",
  },
];

const FALLBACK =
  "I'm not sure I understood that. You can ask me about our programmes (ICAN, ACCA, CITN, ATS, CISA, IFRS), fees, registration, or class schedules.\n\nOr type **whatsapp** to chat with our team directly.";

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "👋 Hi there! I'm the PIN Assistant.\n\nI can help with information about our professional exam programmes, fees, study modes, and registration.\n\nHow can I help you today?",
};

/* Show WhatsApp option after this many user messages */
const WHATSAPP_NUDGE_AFTER = 3;

/* ─── Quick reply chips ──────────────────────────────── */
const QUICK_REPLIES = ["Our programmes", "Fees", "How to register", "Contact us"];

/* ─── Match a user message to a bot response ─────────── */
function matchResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, answer } of BOT_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return answer;
  }
  return FALLBACK;
}

/* ─── Render bot text with basic markdown ────────────── */
function BotText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {lines.map((line, i) => {
        // Bold: **text**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-[var(--navy)]">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function AIChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const nextMessageId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Hide on portal / auth pages */
  const isHidden = SITE_CONFIG.hiddenWidgetPaths.some((p) =>
    pathname.startsWith(p)
  );

  /* Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* Focus input when chat opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  if (isHidden) return null;

  /* Send a user message */
  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextMessageId.current++, role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);

    /* Simulate bot typing delay */
    setTimeout(() => {
      const answer = matchResponse(trimmed);
      setMessages((m) => [
        ...m,
        { id: nextMessageId.current++, role: "bot", text: answer },
      ]);
      setTyping(false);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const showWhatsApp =
    userMsgCount >= WHATSAPP_NUDGE_AFTER ||
    messages.some(
      (m) =>
        m.role === "bot" &&
        (m.text.toLowerCase().includes("whatsapp") ||
          m.text.toLowerCase().includes("speak directly"))
    );

  return (
    <>
      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl
                       bg-white border border-[var(--rule)]"
            style={{
              right: "1.25rem",
              bottom: "5.5rem",
              width: "min(380px, calc(100vw - 2.5rem))",
              height: "min(540px, calc(100dvh - 8rem))",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)",
              }}
            >
              <div className="w-9 h-9 bg-[#F4C430] rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-[var(--navy-dark)]" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  PIN Assistant
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-white/65 text-[11px]">Online · Usually replies instantly</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center
                           text-white/70 hover:bg-white/20 hover:text-white
                           transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--surface)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 bg-[var(--navy)] rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 self-start">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F4C430]" strokeWidth={2.5} />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] text-sm px-3.5 py-2.5 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-[var(--navy)] text-white rounded-tr-sm"
                        : "bg-white text-[var(--ink-muted)] rounded-tl-sm border border-[var(--rule)]"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <BotText text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-[var(--navy)] rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#F4C430]" strokeWidth={2.5} />
                  </div>
                  <div className="bg-white border border-[var(--rule)] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--ink-faint)]"
                          style={{
                            animation: "botTyping 1.2s ease-in-out infinite",
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp CTA — shown after enough interaction */}
              {showWhatsApp && !typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-[#25D366] text-white text-sm font-semibold
                               px-4 py-2.5 rounded-2xl shadow-sm hover:bg-[#1ebe5c]
                               transition-colors max-w-[78%]"
                  >
                    {/* WhatsApp SVG icon */}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L.063 23.75l6.093-1.437A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.617.853.895-3.508-.233-.37A9.793 9.793 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
                    </svg>
                    Continue on WhatsApp
                  </a>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick reply chips — shown only when input is empty */}
            {input === "" && userMsgCount === 0 && (
              <div className="flex gap-2 px-4 py-2.5 overflow-x-auto flex-shrink-0 bg-[var(--surface)] border-t border-[var(--rule)]">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => send(qr)}
                    className="flex-shrink-0 text-xs font-medium text-[var(--navy)] bg-[var(--navy-50)]
                               border border-[var(--navy-100)] px-3 py-1.5 rounded-full
                               hover:bg-[var(--navy)] hover:text-white transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2.5 px-4 py-3 border-t border-[var(--rule)] bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 min-w-0 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)]
                           bg-[var(--surface)] border border-[var(--rule)] rounded-xl px-4 py-2.5
                           focus:outline-none focus:border-[var(--navy)] focus:ring-1
                           focus:ring-[var(--navy)]/20 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-[var(--navy)] text-white flex items-center
                           justify-center hover:bg-[var(--navy-dark)] disabled:opacity-40
                           disabled:pointer-events-none transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Typing keyframe */}
            <style>{`
              @keyframes botTyping {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30%           { transform: translateY(-4px); opacity: 1; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB toggle button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed z-50 flex items-center justify-center
                   w-14 h-14 rounded-full shadow-xl
                   bg-[var(--navy)] text-white
                   hover:bg-[var(--navy-dark)] transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
        style={{ right: "1.25rem", bottom: "1.25rem" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F4C430] border-2 border-white" />
        )}
      </motion.button>
    </>
  );
}
