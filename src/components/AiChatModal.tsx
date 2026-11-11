
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ChatMessage, CompanyProfile } from '../types';
import { StorageService } from '../services/storage';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  companyProfile: CompanyProfile;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  companyProfile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history or welcome message
  useEffect(() => {
    if (isOpen) {
      const history = StorageService.getChatHistory();

      if (history.length > 0) {
        setMessages(history);
      } else {
        const welcomeMessage: ChatMessage = {
          id: 'welcome-01',
          sender: 'assistant',
          text: `Olá! Sou o Assistente Fiscal Inteligente do ConectaContábil.

Estou aqui para esclarecer suas dúvidas sobre tributos, emissão de notas fiscais, declarações anuais (DASN-SIMEI, DEFIS), DCTFWeb e procedimentos fiscais com base nas normas oficiais brasileiras.

Como posso ajudar sua empresa hoje?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          sources: [
            {
              name: 'Receita Federal — Simples Nacional',
              url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/'
            },
            {
              name: 'Portal do Empreendedor',
              url: 'https://www.gov.br/mei'
            }
          ]
        };

        setMessages([welcomeMessage]);
        StorageService.saveChatHistory([welcomeMessage]);
      }

      if (initialQuery.trim()) {
        handleSendMessage(initialQuery.trim());
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();

    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Call secure backend proxy
      const response = await fetch('/api/gemini/fiscal-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,

          // Envia as mensagens anteriores no formato
          // esperado pelo backend: role e content.
          history: messages
            .filter(
              m =>
                m.id !== 'welcome-01' &&
                !m.isError
            )
            .slice(-8)
            .map(m => ({
              role:
                m.sender === 'assistant'
                  ? 'assistant'
                  : 'user',
              content: m.text
            })),

          companyProfile
        })
      });

      if (!response.ok) {
        throw new Error(
          `Erro na resposta do servidor: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text:
          data.reply ||
          'Não foi possível processar a resposta no momento.',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sources: data.sources || [],
        isError: data.errorOccurred
      };

      const updated = [...newMessages, assistantMessage];

      setMessages(updated);
      StorageService.saveChatHistory(updated);

    } catch (err: any) {
      console.error('Chat error:', err);

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text:
          'Não foi possível conectar ao serviço de inteligência artificial no momento. Verifique sua conexão e tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isError: true
      };

      const updated = [...newMessages, errorMessage];

      setMessages(updated);
      StorageService.saveChatHistory(updated);

    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    StorageService.clearChatHistory();

    const freshWelcome: ChatMessage = {
      id: `fresh-${Date.now()}`,
      sender: 'assistant',
      text:
        'Histórico limpo. Como posso ajudar nas obrigações fiscais da sua empresa?',
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages([freshWelcome]);
    StorageService.saveChatHistory([freshWelcome]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 h-[88vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 bg-[#FBFDFB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0E382B] text-[#EAF5EE] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0E382B] flex items-center gap-2">
                <span>Assistente Fiscal ConectaContábil</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Orientação Fiscal Prática
                </span>
              </h3>

              <p className="text-[11px] text-neutral-500">
                Respostas fundamentadas em fontes oficiais para {companyProfile.tradeName} ({companyProfile.structure})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Limpar histórico da conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  isUser
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#0E382B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  </div>
                )}

                <div
                  className={`
                    max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed
                    ${
                      isUser
                        ? 'bg-[#0E382B] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-bl-xs shadow-xs'
                    }
                  `}
                >
                  {/* Message Text with preserved line breaks */}
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Sources Footnote (for Assistant) */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] space-y-1">
                      <span className="font-semibold text-neutral-600 block">
                        Fontes Oficiais Verificadas:
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-emerald-900 transition-colors font-medium"
                          >
                            <span>{src.name}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message timestamp and copy button */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser
                        ? 'text-emerald-200'
                        : 'text-neutral-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() =>
                          handleCopyText(msg.id, msg.text)
                        }
                        className="hover:text-neutral-700 flex items-center gap-1 cursor-pointer ml-3"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">
                              Copiado
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0E382B] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-center gap-2 text-xs text-neutral-600">
                <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
                <span>
                  Consultando normas e manuais oficiais...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida fiscal (ex: Como emitir NFS-e Nacional? Qual o limite do MEI?)..."
              disabled={isLoading}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3.5 rounded-2xl bg-[#0E382B] hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="Enviar pergunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Respostas educativas. Para formalizações de balanço e defesas fiscais, consulte seu contador (CRC).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
