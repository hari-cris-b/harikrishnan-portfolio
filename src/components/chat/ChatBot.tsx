'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getChatResponse, ChatError } from '@/services/gemini';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'error';
  errorType?: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi! I'm Hari's portfolio assistant powered by Google's Gemini AI. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [retryMessage, setRetryMessage] = React.useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const messageId = Date.now().toString();
    const trimmedMessage = inputMessage.trim();

    // Add user message
    const userMessage: Message = {
      id: messageId,
      content: trimmedMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get response from Gemini AI
      const response = await getChatResponse(trimmedMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add small delay before showing bot message
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => [...prev, botMessage]);
      setRetryMessage(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof ChatError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'An error occurred. Please try again.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
        status: 'error',
        errorType: error instanceof ChatError ? error.type : 'unknown',
      };

      setMessages(prev => [...prev, botMessage]);
      setRetryMessage(userMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = async () => {
    if (!retryMessage) return;
    setInputMessage(retryMessage.content);
    setMessages(prev => prev.filter(msg => msg.id !== retryMessage.id));
    setRetryMessage(null);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-[#3d348b] to-[#e6af2e] 
          rounded-full shadow-lg text-white z-50 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ChatBubbleLeftIcon className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-96 h-[500px] bg-white dark:bg-[#191716] 
              rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#3d348b] to-[#e6af2e] text-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Portfolio Assistant</h3>
                <p className="text-xs opacity-80">Powered by Google Gemini</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#3d348b] to-[#e6af2e] text-white'
                        : message.status === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.content}
                    {message.status === 'error' && (
                      <button
                        onClick={handleRetry}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Retry message
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#191716] rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isTyping}
                  className="flex-1 p-2 rounded-xl border border-gray-200 dark:border-gray-800 
                    bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 
                    focus:ring-[#3d348b] dark:focus:ring-[#e6af2e] disabled:opacity-50
                    disabled:cursor-not-allowed transition-opacity duration-200 text-black dark:text-white"
                />
                <motion.button
                  type="submit"
                  disabled={isTyping || !inputMessage.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gradient-to-r from-[#3d348b] to-[#e6af2e] 
                    text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed
                    transition-opacity duration-200"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
