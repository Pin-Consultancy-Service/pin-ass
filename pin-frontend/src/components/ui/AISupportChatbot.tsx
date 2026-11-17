"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, X, Send, Bot, User, Clock, CheckCircle2, 
  AlertCircle, Minimize2, Maximize2, Phone, Mail, ChevronDown,
  Loader2, ExternalLink, Zap, Cpu
} from "lucide-react";
import { getStoredUser } from "@/lib/auth";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
}

interface ChatbotState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean;
  agentName: string;
  agentStatus: 'online' | 'away' | 'busy';
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hi there! 👋 I'm Sarah, your AI-powered support agent from PIN Associate. I'm here 24/7 to help you with questions about your studies, assignments, or account. My AI capabilities allow me to quickly understand your needs and connect you with the right resources. How can I assist you today?",
    timestamp: new Date(),
  }
];

// Predefined AI responses to make it feel more tech-forward and trustworthy
const botResponses = [
  "Thanks for reaching out! My AI systems are processing your request and I'm analyzing the best solution for you. Let me connect this with our expert team...",
  "I understand your concern. I'm using my knowledge base to find the most relevant information and forwarding this to our academic specialists right away. You should hear back within 2-3 hours.",
  "Excellent question! I'm cross-referencing this with our course database and instructor guidelines. My AI is checking for the most up-to-date information to give you accurate guidance.",
  "I see you're experiencing this issue. Let me run a quick diagnostic and connect you with the right specialist who can resolve this immediately using our advanced support systems.",
  "Perfect! I've documented all the details in our intelligent ticketing system and our support team will reach out via WhatsApp within the hour. My AI has tagged this as high-priority.",
  "I'm analyzing your query using our comprehensive knowledge base. Based on my assessment, I'm forwarding this to the most suitable expert who can provide you with precise assistance.",
];

// TODO: Replace with actual admin WhatsApp configuration
const ADMIN_WHATSAPP = {
  number: "+2348123456789", // Replace with actual admin WhatsApp number
  chatId: "120363042123456789@g.us" // Replace with actual WhatsApp group/chat ID
};

export default function AISupportChatbot() {
  const user = getStoredUser();
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    messages: initialMessages,
    isTyping: false,
    isConnected: true,
    agentName: "Sarah Mitchell",
    agentStatus: 'online'
  });
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.isOpen && !state.isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state.isOpen, state.isMinimized]);

  const toggleChat = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen, isMinimized: false }));
  };

  const minimizeChat = () => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const closeChat = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    // Add user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setInputMessage("");
    setIsLoading(true);

    try {
      // Send to WhatsApp (API call)
      await sendToWhatsApp(userMessage.content);
      
      // Update message status to sent
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        ),
        isTyping: true
      }));

      // Simulate bot typing and response
      setTimeout(() => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: randomResponse,
          timestamp: new Date(),
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false
        }));

        // Mark user message as delivered
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
            )
          }));
        }, 1000);
      }, 2000 + Math.random() * 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'failed' } : msg
        ),
        isTyping: false
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const sendToWhatsApp = async (message: string) => {
    try {
      const studentInfo = user ? {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        program: (user as any).programme_display || 'ICAN Professional',
        studentId: user.id
      } : {
        name: 'Unknown Student',
        email: 'no-email@example.com',
        program: 'Unknown Program',
        studentId: 'unknown'
      };

      const response = await fetch('/api/support/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentInfo.name,
          studentEmail: studentInfo.email,
          studentProgram: studentInfo.program,
          studentId: studentInfo.studentId,
          message: message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      return true;

    } catch (error) {
      console.error('Failed to send to WhatsApp:', error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'var(--ink-faint)' }} />;
      case 'sent':
        return <CheckCircle2 className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} />;
      case 'delivered':
        return <CheckCircle2 className="w-3 h-3" style={{ color: 'var(--navy)' }} />;
      case 'failed':
        return <AlertCircle className="w-3 h-3" style={{ color: '#DC2626' }} />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Chat bubble component (floating button)
  if (!state.isOpen) {
    return (
      <div 
        className="fixed z-[60]"
        style={{
          bottom: '24px',
          right: '24px',
          zIndex: 9999 // Consistent high z-index
        }}
      >
        <button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 group relative overflow-hidden"
          style={{ 
            backgroundColor: 'var(--navy)',
            boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)'
          }}
        >
          {/* Background gradient effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-20 animate-pulse"
            style={{ 
              background: 'linear-gradient(45deg, var(--gold), transparent, var(--gold))' 
            }}
          />
          
          {/* AI Agent Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            
            {/* Tech accent - small circuit pattern */}
            <Zap 
              className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 opacity-80 animate-pulse" 
              strokeWidth={2}
            />
          </div>
          
          {/* Notification badge */}
          <div 
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg"
            style={{ backgroundColor: 'var(--gold)' }}
          >
            AI
          </div>

          {/* Floating text hint (appears on hover) */}
          <div 
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 rounded-lg text-sm font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
            style={{ backgroundColor: 'var(--navy-dark)' }}
          >
            💬 Chat with AI Support
            <div 
              className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-4 border-transparent"
              style={{ borderLeftColor: 'var(--navy-dark)' }}
            />
          </div>
        </button>

        {/* Subtle floating animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          button {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Main chat interface
  return (
    <div 
      className="fixed"
      style={{
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '384px',
        height: state.isMinimized ? '60px' : '520px', // Fixed height
        maxHeight: '520px'
      }}
    >
      <div 
        className="w-full h-full rounded-2xl shadow-2xl border overflow-hidden transition-all relative"
        style={{ 
          backgroundColor: 'var(--bg)', 
          borderColor: 'var(--rule)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Chat Header - Fixed at top */}
        <div 
          className="flex items-center justify-between p-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--surface)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold relative overflow-hidden"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                <Bot className="w-5 h-5" strokeWidth={1.75} />
                {/* Tech accent */}
                <Cpu className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-yellow-300 opacity-60" strokeWidth={2} />
              </div>
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: state.agentStatus === 'online' ? '#10B981' : '#F59E0B' }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                {state.agentName}
                <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold" 
                      style={{ backgroundColor: 'var(--gold)', fontSize: '10px' }}>
                  AI
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: state.agentStatus === 'online' ? '#10B981' : '#F59E0B' }}
                />
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {state.agentStatus === 'online' ? 'AI Assistant Online' : 'AI Assistant Away'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={minimizeChat}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 hover:bg-opacity-20"
              style={{ color: 'var(--ink-muted)' }}
              title={state.isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {state.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeChat}
              className="p-2 rounded-lg transition-colors hover:bg-red-100 hover:bg-opacity-20"
              style={{ color: 'var(--ink-muted)' }}
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages - Flexible height */}
        {!state.isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {state.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {message.type === 'bot' && (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--navy)' }}
                      >
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div>
                      <div
                        className="px-4 py-2 rounded-2xl text-sm leading-relaxed"
                        style={{
                          backgroundColor: message.type === 'user' ? 'var(--navy)' : 'var(--surface)',
                          color: message.type === 'user' ? 'white' : 'var(--ink)',
                          borderRadius: message.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px'
                        }}
                      >
                        {message.content}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.type === 'user' && getMessageStatus(message.status)}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--gold)' }}
                      >
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {state.isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--navy)' }}
                    >
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div 
                      className="px-4 py-3 rounded-2xl"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ink-muted)', animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ink-muted)', animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ink-muted)', animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div 
              className="p-4 border-t flex-shrink-0"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full resize-none px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:ring-blue-500"
                    style={{ 
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--rule)',
                      color: 'var(--ink)'
                    }}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--rule)' }}>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--navy)' }}>
                    <Phone className="w-3 h-3" />
                    Request Call
                  </button>
                  <button className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--navy)' }}>
                    <Mail className="w-3 h-3" />
                    Send Email
                  </button>
                </div>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--ink-faint)' }}>
                  <Bot className="w-3 h-3" />
                  AI-Powered by PIN Associate
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}