import { Bot, RotateCcw, Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCoachIA } from "../hooks/useCoachIA";

const QUICK_QUESTIONS = [
  "Comment améliorer ma nutrition ?",
  "Quel sport pour perdre du poids ?",
  "Combien de calories par jour ?",
  "Comment bien récupérer après le sport ?",
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function CoachIAPage() {
  const { user } = useAuth();
  const { messages, isTyping, sendMessage, clearConversation } = useCoachIA(user?.backendId);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const userInitials = user?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* En-tête Coach */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Bot size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Coach IA Santé</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">En ligne — réponse en quelques secondes</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearConversation}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-all text-sm"
          title="Effacer la conversation"
        >
          <RotateCcw size={14} />
          <span>Nouvelle conversation</span>
        </button>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-message-pop ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              {message.role === "assistant" ? (
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shrink-0 mt-1">
                  <Bot size={14} className="text-emerald-400" />
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1"
                  style={{ backgroundColor: user?.avatarColor ?? "#10b981" }}
                >
                  {userInitials}
                </div>
              )}

              {/* Bulle */}
              <div
                className={`max-w-[72%] ${
                  message.role === "user" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-emerald-500 text-white rounded-tr-sm"
                      : "bg-slate-700 text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-[11px] text-slate-500 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Indicateur de frappe */}
          {isTyping && (
            <div className="flex gap-3 animate-message-pop">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shrink-0 mt-1">
                <Bot size={14} className="text-emerald-400" />
              </div>
              <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Questions rapides */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-500 mb-2">Questions fréquentes :</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-emerald-500/20 border border-slate-600 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 rounded-xl text-xs transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-slate-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question à votre coach..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
