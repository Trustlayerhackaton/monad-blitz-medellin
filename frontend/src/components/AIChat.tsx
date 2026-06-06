"use client";

import { MessageCircle, Send, Bot, User as UserIcon, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AIChatProps {
  score: number;
  consecutivePayments: number;
  rewards: number;
  level: string;
  isDemoMode?: boolean;
}

export function AIChat({
  score,
  consecutivePayments,
  rewards,
  level,
  isDemoMode = false,
}: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "¡Hola! Soy tu asistente de IA. Puedo ayudarte con información sobre tu perfil, score, recompensas y más. ¿En qué puedo ayudarte?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("score") || lowerMessage.includes("puntuación")) {
      return `Tu Payment Score actual es ${score} puntos. Estás en el nivel ${level}. Para mejorarlo, mantén tus pagos puntuales y aumenta tu racha de pagos consecutivos.`;
    }

    if (lowerMessage.includes("recompensa") || lowerMessage.includes("mMonad") || lowerMessage.includes("Monad")) {
      return `Tienes ${rewards} mMonad acumulados. Las recompensas se otorgan por cada pago puntual y aumentan según tu nivel (${level}) y tu racha de pagos (${consecutivePayments}).`;
    }

    if (lowerMessage.includes("racha") || lowerMessage.includes("pagos consecutivos")) {
      return `Tienes ${consecutivePayments} pagos consecutivos. ¡Excelente trabajo! Mantén esta racha para obtener más recompensas y mejorar tu score.`;
    }

    if (lowerMessage.includes("nivel") || lowerMessage.includes("level")) {
      return `Estás en el nivel ${level}. Los niveles se basan en tu Payment Score: Bronce (0-599), Plata (600-749), Oro (750-849), Platino (850-949), y Diamante (950+).`;
    }

    if (lowerMessage.includes("crédito") || lowerMessage.includes("prestamo")) {
      return `Con tu score de ${score}, puedes acceder a créditos pre-aprobados. Revisa la sección de Línea de Crédito en tu dashboard para más detalles.`;
    }

    if (lowerMessage.includes("hola") || lowerMessage.includes("hi") || lowerMessage.includes("buenos días")) {
      return "¡Hola! ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre tu score, recompensas, nivel, créditos y más.";
    }

    if (lowerMessage.includes("ayuda") || lowerMessage.includes("help")) {
      return "Puedo ayudarte con: información sobre tu Payment Score, recompensas mMonad, nivel actual, racha de pagos, créditos pre-aprobados, y predicciones de score. ¿Qué te gustaría saber?";
    }

    return "Entiendo tu pregunta. Basándome en tu perfil actual, puedo ayudarte con información sobre tu score, recompensas, nivel y créditos. ¿Puedes ser más específico?";
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: getBotResponse(inputText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full transition-all duration-300 z-40"
        style={{ 
          background: 'linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)',
          color: '#0A0F1E',
          boxShadow: '0 4px 20px rgba(0, 255, 135, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 255, 135, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 255, 135, 0.3)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] rounded-xl z-50 flex flex-col backdrop-blur-sm" style={{ backgroundColor: '#1A2332', border: '1px solid rgba(0, 255, 135, 0.2)', boxShadow: '0 0 40px rgba(0, 255, 135, 0.2)' }}>
          {/* Header */}
          <div className="px-4 py-3 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#131B2E', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" style={{ color: '#00FF87' }} />
              <h3 className="text-lg font-bold" style={{ color: '#00FF87', letterSpacing: '-0.02em' }}>Asistente IA</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg transition-all duration-300"
              style={{ color: '#8B92A7' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00FF87';
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 135, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8B92A7';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#1A2332' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: message.type === "user" 
                      ? 'rgba(0, 255, 135, 0.2)' 
                      : 'rgba(0, 217, 255, 0.2)',
                    border: `1px solid ${message.type === "user" ? 'rgba(0, 255, 135, 0.3)' : 'rgba(0, 217, 255, 0.3)'}`
                  }}
                >
                  {message.type === "user" ? (
                    <UserIcon className="w-4 h-4" style={{ color: '#00FF87' }} />
                  ) : (
                    <Bot className="w-4 h-4" style={{ color: '#00D9FF' }} />
                  )}
                </div>
                <div
                  className="max-w-[75%] p-3 rounded-lg"
                  style={{
                    backgroundColor: message.type === "user"
                      ? 'rgba(0, 255, 135, 0.15)'
                      : '#131B2E',
                    border: `1px solid ${message.type === "user" ? 'rgba(0, 255, 135, 0.2)' : 'rgba(139, 146, 167, 0.1)'}`,
                    color: message.type === "user" ? '#FFFFFF' : '#8B92A7'
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#131B2E' }}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: '#1A2332',
                  border: '1px solid rgba(0, 255, 135, 0.2)',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 135, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 135, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #00FF87 0%, #00D9FF 100%)',
                  color: '#0A0F1E',
                  boxShadow: '0 2px 10px rgba(0, 255, 135, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 255, 135, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

