import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What's my total balance?",
    "How much did I spend this month?",
    "Show my recent transactions",
  ];

  const formatAIResponse = (text: string) => {
    // Remove excessive formatting and make it more conversational
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/###/g, '')  // Remove headers
      .replace(/\n{3,}/g, '\n\n') // Limit line breaks
      .trim();
  };

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat/', { question });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: formatAIResponse(response.data.answer),
        timestamp: new Date(response.data.timestamp),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Chat Button - Adjusted position to avoid navigation */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-4 h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center text-white z-40 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)' }}
      >
        <Image 
          src="/ai_assistant.png" 
          alt="AI Assistant" 
          width={64} 
          height={64}
          className="object-cover"
        />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-4 right-4 w-[min(400px,calc(100vw-2rem))] h-[600px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-emerald-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">FlowFunds AI</h3>
                    <p className="text-xs opacity-90">Financial Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ask me anything!</h4>
                    <p className="text-sm text-gray-600 mb-4">I can help you understand your finances</p>
                    
                    <div className="space-y-2">
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          className="block w-full text-left px-4 py-3 text-sm bg-white rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors border border-gray-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {message.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <MessageCircle className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-xs font-medium text-emerald-600">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        <span className="text-sm text-gray-600">Analyzing your finances...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={isLoading}
                    className="flex-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

