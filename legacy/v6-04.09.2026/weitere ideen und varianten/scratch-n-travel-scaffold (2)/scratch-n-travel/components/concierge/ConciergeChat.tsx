// components/concierge/ConciergeChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AffiliateDisclaimer } from "@/components/legal/AffiliateDisclaimer";
import styles from "./ConciergeChat.module.css";

interface Msg {
  role: "user" | "assistant";
  content: string;
  mentionsAffiliate?: boolean;
}

const QUICK_IDEAS = [
  "Was kann ich heute bei diesem Wetter unternehmen?",
  "Zeig mir Geheimtipps für Hundestrände",
  "Finde mir Locals mit ähnlichen Hobbys",
  "eSIM-Empfehlung für Portugal",
];

export function ConciergeChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "offline">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateOnline() {
      setStatus(navigator.onLine ? "idle" : "offline");
    }
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || status === "offline") return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStatus("sending");

    try {
      const res = await fetch("/api/ai-concierge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      // Vereinfachtes SSE-Parsing (Claude-Streaming liefert `content_block_delta`-Events)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data:")) continue;
          try {
            const evt = JSON.parse(line.slice(5));
            if (evt.type === "content_block_delta" && evt.delta?.text) {
              acc += evt.delta.text;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: acc,
                  mentionsAffiliate: /esim|affiliate/i.test(acc),
                };
                return copy;
              });
            }
          } catch {
            /* Keep-alive/Steuerzeilen ignorieren */
          }
        }
      }
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.contextChips}>
        <span className={styles.chip}>🌤️ Live Wetter</span>
        <span className={styles.chip}>🌊 Wassertemperatur</span>
        <span className={`${styles.chip} ${styles.trust}`}>🔒 Cookie-Schutz aktiv</span>
      </div>

      <div className={styles.thread}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>Wonach suchst du?</p>
            <div className={styles.quickIdeas}>
              {QUICK_IDEAS.map((q) => (
                <button key={q} onClick={() => send(q)} className={styles.ideaChip}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.assistant}`}>
            {m.content || (status === "sending" && i === messages.length - 1 ? <TypingDots /> : "")}
            {m.mentionsAffiliate && <AffiliateDisclaimer />}
          </div>
        ))}

        {status === "error" && (
          <div className={`${styles.bubble} ${styles.errorBubble}`}>
            Da ist etwas schiefgelaufen, versuch&apos;s nochmal. 🔁
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === "offline"}
          placeholder={status === "offline" ? "KI-Concierge benötigt Internetverbindung" : "Frag den Concierge…"}
          className={styles.input}
        />
        <button type="submit" disabled={status === "offline" || status === "sending"} className={styles.sendBtn}>
          Senden
        </button>
      </form>
    </div>
  );
}

function TypingDots() {
  return (
    <span className={styles.typing} aria-label="Concierge tippt">
      <i />
      <i />
      <i />
    </span>
  );
}
