'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'assistant' | 'user';
  text: string;
}

interface BrainChatProps {
  activeLobe?: string;
}

const SECTION_OPENERS: Record<string, string> = {
  research:
    "I'm looking at your research context — EEG decoding and seizure detection. What would you like to know about Owen's work in neural signal processing?",
  projects:
    "Based on the projects section — NeuroLink Dashboard and Synapse Annotator are both live. Ask me about the tech stack, outcomes, or what problem they solve.",
  experience:
    "You're in the experience section. Owen has led product at NeurotechX and shipped data pipelines at a MedTech company. What would you like to dig into?",
  contact:
    "Ready to connect? Owen is open to research collaborations, internships, and product roles at the intersection of neurotech and AI. How can I help?",
};

const FALLBACK_OPENER =
  "I'm your Neuro Guide — ask me anything about Owen's research, projects, or experience.";

const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['eeg', 'signal', 'bci', 'motor', 'prosthetic', 'decode', 'decod'],
    reply:
      "Owen's EEG research focuses on real-time motor-intention decoding for upper-limb prosthetics. The pipeline runs PyTorch models on cleaned EEG epochs, targeting sub-200 ms latency from signal to control command. A first-author NeurIPS workshop paper is in preparation.",
  },
  {
    keywords: ['seizure', 'epilepsy', 'toronto', 'self-supervised', 'ssl', 'contrastive'],
    reply:
      "At Toronto Western's Epilepsy Program, Owen built a contrastive self-supervised learning framework on long-term scalp EEG — no manual labels required. It achieved a 12% F1 improvement over supervised baselines and was presented at EMBC 2024.",
  },
  {
    keywords: ['neurolink', 'dashboard', 'medhacks', 'openbci', 'hackathon'],
    reply:
      "NeuroLink Dashboard streams EEG from an OpenBCI headset, runs TensorFlow Lite anomaly detection on-device, and surfaces alerts via a Next.js UI — all in under 200 ms on a Raspberry Pi 4. It won 1st place at MedHacks 2024 (300+ participants).",
  },
  {
    keywords: ['synapse', 'annotator', 'sam', 'segmentation', 'microscopy', 'active learning'],
    reply:
      "Synapse Annotator pairs a SAM-based foundation model with an active-learning loop for 3D EM stack labeling. It cut annotation time by 60% and is actively used by two UW connectomics labs.",
  },
  {
    keywords: ['neurotech', 'headband', 'neurofeedback', 'product', 'lead', 'hardware'],
    reply:
      "As Product Lead at NeurotechX UW, Owen runs a 12-person team building a consumer neurofeedback headband. Shipped v1 on a $3k budget, ran 20+ user research sessions, and secured $8k in innovation grants — all while balancing coursework.",
  },
  {
    keywords: ['intern', 'medtech', 'kafka', 'pipeline', 'fhir', 'wearable', 'latency'],
    reply:
      "At MedTech Co. (Toronto, 2024), Owen worked on the sensor data ingestion pipeline — cutting latency 35% via batching optimizations, shipping 3 production features, and authoring an internal RFC on FHIR normalization.",
  },
  {
    keywords: ['contact', 'email', 'hire', 'opportunity', 'collaborate', 'work with'],
    reply:
      "Best way to reach Owen: o5kim@uwaterloo.ca. He's targeting research and product roles at the intersection of neuroscience, clinical AI, and hardware — especially anything involving BCI, diagnostic tools, or neurotech.",
  },
  {
    keywords: ['stack', 'tech', 'language', 'framework', 'tool'],
    reply:
      "Owen's core stack: Python (PyTorch, NumPy, MNE), TypeScript/React, Next.js, FastAPI, and PostgreSQL. Hardware side: OpenBCI, Arduino, Raspberry Pi. Design: Figma. He picks the right tool for the signal — pun intended.",
  },
];

function getReply(input: string, activeLobe?: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  if (activeLobe === 'research') {
    return "Owen's research spans motor BCI and seizure detection — two problems where better signal processing directly improves patients' lives. What aspect interests you most?";
  }
  if (activeLobe === 'projects') {
    return "Both featured projects are open-source. NeuroLink's GitHub has 120+ stars; Synapse Annotator has a live demo. Want the links or more details on either?";
  }
  if (activeLobe === 'experience') {
    return "Owen has worn multiple hats — hardware PM, ML engineer, and clinical data engineer — all within neurotech. Any of those roles you'd like to know more about?";
  }
  return "That's a great question. Owen's work sits at the intersection of neuroscience, AI, and product. Try asking about his EEG research, the NeuroLink project, or how to get in touch.";
}

export default function BrainChat({ activeLobe }: BrainChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: (activeLobe && SECTION_OPENERS[activeLobe]) ?? FALLBACK_OPENER,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counter = useRef(1);

  // Re-seed opener when activeLobe changes
  useEffect(() => {
    const opener = (activeLobe && SECTION_OPENERS[activeLobe]) ?? FALLBACK_OPENER;
    setMessages([{ id: 0, role: 'assistant', text: opener }]);
  }, [activeLobe]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: counter.current++, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      const reply = getReply(trimmed, activeLobe);
      setMessages((prev) => [...prev, { id: counter.current++, role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Message list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(127,119,221,0.2) transparent',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '88%',
              fontSize: 12.5,
              lineHeight: 1.6,
              padding: '8px 11px',
              borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: msg.role === 'user'
                ? 'rgba(127,119,221,0.22)'
                : 'rgba(255,255,255,0.05)',
              color: msg.role === 'user' ? '#d4d0f5' : '#9898b0',
              border: `0.5px solid ${msg.role === 'user' ? 'rgba(127,119,221,0.35)' : 'rgba(255,255,255,0.07)'}`,
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '10px 10px 10px 2px',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.07)',
              display: 'flex',
              gap: 3,
              alignItems: 'center',
            }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#7F77DD',
                    animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        padding: '10px 12px',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask about Owen's work…"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '7px 10px',
            fontSize: 12,
            color: '#f0f0f5',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || isTyping}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: input.trim() && !isTyping ? 'rgba(127,119,221,0.3)' : 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(127,119,221,0.3)',
            color: '#7F77DD',
            cursor: input.trim() && !isTyping ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 150ms',
          }}
          aria-label="Send message"
        >
          <svg width={13} height={13} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 1L1 7l5 1.5L7.5 14 13 1z" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
