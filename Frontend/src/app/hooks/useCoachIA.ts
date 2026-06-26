import { useState, useCallback, useEffect } from "react";
import type { CoachMessage } from "../types";
import { apiCall } from "../services/api";

const WELCOME_MESSAGE: CoachMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour ! Je suis votre Coach IA Santé & Fit. Je suis là pour vous accompagner sur vos objectifs nutritionnels et sportifs. Comment puis-je vous aider aujourd'hui ?",
  timestamp: new Date(),
};

const MOCK_RESPONSES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["calorie", "calories", "manger", "alimentation", "nourriture"],
    reply:
      "Pour vos apports caloriques, la règle de base est de viser un déficit modéré de 300-500 kcal/jour si vous souhaitez perdre du poids, ou un surplus similaire pour prendre de la masse. L'application surveille déjà vos données — consultez la page **Nutrition** pour voir votre profil détaillé.",
  },
  {
    keywords: ["sport", "exercice", "entraînement", "séance", "activité"],
    reply:
      "D'après vos données, vous avez une bonne régularité sportive ! Les recommandations OMS conseillent 150 min d'activité modérée par semaine. Pour progresser, alternez cardio et musculation, et planifiez au moins 1 jour de repos entre deux séances intensives.",
  },
  {
    keywords: ["poids", "perdre", "minceur", "grossir", "masse", "bmi", "imc"],
    reply:
      "La gestion du poids repose sur l'équilibre entre apports et dépenses énergétiques. Je vous recommande de fixer un objectif réaliste : -0,5 kg/semaine est idéal pour préserver la masse musculaire. Consultez votre BMI dans la page **Patients** pour suivre votre évolution.",
  },
  {
    keywords: ["régime", "diet", "nutrition", "alimentation", "protéine"],
    reply:
      "Votre plan alimentaire devrait inclure : 40-50% de glucides complexes, 25-35% de protéines (1,6-2,2g/kg de poids) et 20-30% de lipides sains. Évitez les régimes trop restrictifs, ils ralentissent le métabolisme sur le long terme.",
  },
  {
    keywords: ["sommeil", "dormir", "récupération", "fatigue", "repos"],
    reply:
      "Le sommeil est un pilier souvent négligé de la santé. Visez 7-9h par nuit. Durant le sommeil profond, l'hormone de croissance est libérée — essentielle à la récupération musculaire. Maintenez des horaires réguliers, même le week-end.",
  },
  {
    keywords: ["stress", "anxiété", "mental", "psychologique", "détente"],
    reply:
      "Le stress chronique élève le cortisol, favorisant le stockage des graisses abdominales. Intégrez des pratiques de relaxation : 10 min de respiration profonde, yoga ou marche en nature. L'exercice régulier est lui-même un excellent régulateur du stress.",
  },
  {
    keywords: ["eau", "hydratation", "boire", "soif"],
    reply:
      "L'hydratation est cruciale : visez 35-40ml/kg de poids corporel par jour, davantage si vous transpirez beaucoup. L'eau améliore la performance sportive dès 2% de déshydratation, et optimise le métabolisme et l'élimination des toxines.",
  },
];

const DEFAULT_REPLY =
  "C'est une excellente question ! En tant que coach IA, je vous recommande d'adopter une approche progressive et durable. Pouvez-vous me préciser votre objectif principal : perte de poids, gain musculaire, amélioration de l'endurance ou bien-être général ?";

function buildAIReply(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  const match = MOCK_RESPONSES.find((r) =>
    r.keywords.some((kw) => lowerMessage.includes(kw)),
  );
  return match?.reply ?? DEFAULT_REPLY;
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

interface BackendMessage {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

interface UseCoachIAReturn {
  messages: CoachMessage[];
  isTyping: boolean;
  sendMessage: (content: string, userId?: number) => void;
  clearConversation: (userId?: number) => void;
}

async function fetchMistralReply(content: string, userId?: number): Promise<string> {
  const response = await apiCall<{ reply: string }>("/coach/chat", {
    method: "POST",
    body: JSON.stringify({ message: content, user_id: userId }),
  });
  return response.reply;
}

function backendMessageToCoachMessage(msg: BackendMessage): CoachMessage {
  return {
    id: `db_${msg.id}`,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    timestamp: new Date(msg.created_at),
  };
}

export function useCoachIA(userId?: number): UseCoachIAReturn {
  const [messages, setMessages] = useState<CoachMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!userId) return;
    void apiCall<BackendMessage[]>(`/coach/history/${userId}`)
      .then((history) => {
        if (history.length === 0) return;
        setMessages([WELCOME_MESSAGE, ...history.map(backendMessageToCoachMessage)]);
      })
      .catch(() => null);
  }, [userId]);

  const sendMessage = useCallback((content: string, userIdOverride?: number) => {
    const effectiveUserId = userIdOverride ?? userId;
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: CoachMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    void fetchMistralReply(trimmed, effectiveUserId)
      .catch(() => buildAIReply(trimmed))
      .then((replyContent) => {
        const assistantMessage: CoachMessage = {
          id: generateId(),
          role: "assistant",
          content: replyContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      });
  }, [userId]);

  const clearConversation = useCallback((userIdOverride?: number) => {
    const effectiveUserId = userIdOverride ?? userId;
    if (effectiveUserId) {
      void apiCall(`/coach/history/${effectiveUserId}`, { method: "DELETE" }).catch(() => null);
    }
    setMessages([WELCOME_MESSAGE]);
  }, [userId]);

  return { messages, isTyping, sendMessage, clearConversation };
}
