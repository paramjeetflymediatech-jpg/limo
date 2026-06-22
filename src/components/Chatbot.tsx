"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"form" | "choice" | "ai" | "live">("form");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to FantasticLimo VIP Concierge. To assist you with your booking or inquiry, please provide your contact details.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [liveSentMessage, setLiveSentMessage] = useState("");
  const [liveSentSuccess, setLiveSentSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, stage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    // Transition to choice screen
    setStage("choice");
  };

  const selectPath = async (selectedPath: "ai" | "live") => {
    setStage(selectedPath);

    // Call API to register lead
    try {
      await fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          path: selectedPath,
          messages: messages.filter((m) => m.id !== "welcome"), // Exclude start welcome msg
        }),
      });
    } catch (error) {
      console.error("Error registering chatbot lead:", error);
    }

    if (selectedPath === "ai") {
      setMessages((prev) => [
        ...prev,
        {
          id: `path-choice-${Date.now()}`,
          sender: "bot",
          text: `Thank you, ${formData.name}. I'm our AI Concierge. I can help you with fleet details, service packages, pricing, or submitting a reservation request. What can I answer for you?`,
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsgText = inputValue;
    setInputValue("");

    const newMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userMsgText,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      // Map active conversation messages for multi-turn history, excluding the static welcome prompt
      const conversationHistory = [...messages, newMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "bot" ? "model" : "user",
          text: m.text,
        }));

      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: conversationHistory,
        }),
      });
      const data = await response.json();

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: data.reply || "I'm sorry, I encountered an issue. Can you please repeat that?",
        },
      ]);

      // Automatically sync latest conversation back to lead dispatch
      const updatedMessages = [...messages, newMsg, { id: "temp", sender: "bot", text: data.reply }];
      fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          path: "ai",
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      }).catch((err) => console.error("Error updating chat log lead:", err));

    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-err-${Date.now()}`,
          sender: "bot",
          text: "Concierge connection interrupted. Please try again or call us.",
        },
      ]);
    }
  };

  const handleLiveInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveSentMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      await fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          path: "live",
          messages: [
            { sender: "user", text: `[Live Rep Request Message]: ${liveSentMessage}` },
          ],
        }),
      });

      setLiveSentSuccess(true);
      setLiveSentMessage("");
    } catch (error) {
      console.error("Error sending live inquiry:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed top-5 right-16 md:right-22 xl:top-auto xl:bottom-8 xl:right-8 z-50 flex items-center justify-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-10 h-10 xl:w-14 xl:h-14 border border-luxury-gold/60 rounded-full shadow-[0_4px_25px_rgba(208,165,17,0.4)] hover:shadow-[0_4px_35px_rgba(208,165,17,0.65)] hover:scale-105 transition-all duration-300 flex items-center justify-center group relative cursor-pointer"
          aria-label="Toggle Concierge Chatbot"
        >
          <span className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-25 group-hover:opacity-40" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="white"
                className="w-5 h-5 xl:w-6 xl:h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 xl:w-8 xl:h-8 relative flex items-center justify-center"
              >
                <Image
                  src="/images/chatbot-icon.png"
                  alt="Chatbot Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-8 w-[380px] h-[580px] max-w-[92vw] z-50 flex flex-col bg-white rounded-2xl border border-luxury-gold/40 shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#0a1a14] via-[#051c14] to-[#0d1a14] border-b border-luxury-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-black border border-luxury-gold/40 overflow-hidden relative shadow-[0_0_10px_rgba(208,165,17,0.15)] flex items-center justify-center">
                    <Image
                      src="/images/chatbot-icon.png"
                      alt="FantasticLimo Logo"
                      fill
                      sizes="32px"
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-matte-black animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-semibold tracking-wide" style={{ color: '#ffffff' }}>
                    FantasticLimo Concierge
                  </h4>
                  <span className="text-[9px] uppercase tracking-wider font-bold block" style={{ color: '#D0A511' }}>
                    AI Digital Host
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="transition-colors cursor-pointer"
                style={{ color: '#cccccc' }}
                aria-label="Close Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#fdfbf7]">
              
              {/* STAGE 1: Lead Information Form */}
              {stage === "form" && (
                <div className="space-y-4">
                  <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-4 text-center">
                    <p className="text-xs leading-relaxed font-light" style={{ color: '#333333' }}>
                      Register with our concierge desk to unlock real-time pricing, vehicle availability, and personalized assistance.
                    </p>
                  </div>

                  <form onSubmit={submitForm} className="space-y-3.5">
                    <div>
                      <label htmlFor="chat-name" className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1" style={{ color: '#333333' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="chat-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-luxury-gold/30 focus:border-luxury-gold rounded px-3 py-2 text-sm focus:outline-none transition-all placeholder:text-gray-400"
                        style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="chat-email" className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1" style={{ color: '#333333' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="chat-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-luxury-gold/30 focus:border-luxury-gold rounded px-3 py-2 text-sm focus:outline-none transition-all placeholder:text-gray-400"
                        style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="chat-phone" className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1" style={{ color: '#333333' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="chat-phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-luxury-gold/30 focus:border-luxury-gold rounded px-3 py-2 text-sm focus:outline-none transition-all placeholder:text-gray-400"
                        style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        placeholder="+1 (306) 240-4000"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-luxury-gold to-[#b38f10] font-bold text-xs uppercase tracking-widest py-3 rounded hover:brightness-110 transition-all cursor-pointer shadow-lg"
                      style={{ color: '#000000' }}
                    >
                      Start Conversation
                    </button>
                  </form>
                </div>
              )}

              {/* STAGE 2: AI / Live Choice */}
              {stage === "choice" && (
                <div className="space-y-5 py-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto text-xl mb-2" style={{ color: '#D0A511' }}>
                    ✨
                  </div>
                  <div>
                    <h5 className="font-serif text-base font-bold mb-1" style={{ color: '#000000' }}>
                      Welcome, {formData.name}
                    </h5>
                    <p className="text-xs font-light leading-relaxed" style={{ color: '#4b5563' }}>
                      Your client inquiry details have been saved. How would you like to continue?
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => selectPath("ai")}
                      className="w-full bg-[#fdfbf7] border border-luxury-gold/30 hover:border-luxury-gold py-3 px-4 rounded text-xs uppercase tracking-widest font-semibold transition-all duration-300 text-left flex items-center justify-between group cursor-pointer"
                      style={{ color: '#000000' }}
                    >
                      <span style={{ color: '#000000' }}>🤖 Chat with AI Concierge</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#D0A511' }}>&rarr;</span>
                    </button>

                    <button
                      onClick={() => selectPath("live")}
                      className="w-full bg-[#fdfbf7] border border-gray-200 hover:border-gray-400 py-3 px-4 rounded text-xs uppercase tracking-widest font-semibold transition-all duration-300 text-left flex items-center justify-between group cursor-pointer"
                      style={{ color: '#000000' }}
                    >
                      <span style={{ color: '#000000' }}>👤 Connect with Live Agent</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#000000' }}>&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: AI Chat Interface */}
              {stage === "ai" && (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isBot = msg.sender === "bot";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                            isBot
                              ? "bg-[#f0ebd8] border border-luxury-gold/20"
                              : "bg-luxury-gold font-medium"
                          }`}
                          style={{ color: '#000000' }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#f0ebd8] border border-luxury-gold/20 rounded-lg p-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* STAGE 4: Live Representative Details */}
              {stage === "live" && (
                <div className="space-y-4">
                  <div className="bg-luxury-gold/10 border border-luxury-gold/25 rounded-lg p-4 space-y-3">
                    <span className="text-[9px] uppercase tracking-widest font-bold block" style={{ color: '#D0A511' }}>
                      Status: Alerting Dispatch Desk
                    </span>
                    <h5 className="font-serif font-bold text-sm" style={{ color: '#000000' }}>
                      Connecting with Live Representative
                    </h5>
                    <p className="text-xs font-light leading-relaxed" style={{ color: '#4b5563' }}>
                      A dispatcher has been notified of your request. While they review your details, you can submit your specific travel question or details below.
                    </p>
                  </div>

                  {!liveSentSuccess ? (
                    <form onSubmit={handleLiveInquirySubmit} className="space-y-3">
                      <div>
                        <label htmlFor="live-message" className="text-[10px] uppercase tracking-[0.15em] block mb-1" style={{ color: '#6b7280' }}>
                          Your Travel Details / Message
                        </label>
                        <textarea
                          id="live-message"
                          required
                          rows={3}
                          value={liveSentMessage}
                          onChange={(e) => setLiveSentMessage(e.target.value)}
                          className="w-full border border-luxury-gold/20 focus:border-luxury-gold rounded p-2.5 text-xs focus:outline-none transition-all placeholder:text-gray-500 resize-none"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                          placeholder="e.g. Need airport pick-up from BC Place to hotel on Saturday for 4 guests..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-luxury-gold font-bold text-xs uppercase tracking-widest py-2.5 rounded hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
                        style={{ color: '#000000' }}
                      >
                        {isSending ? "Sending Alert..." : "Send Request Details"}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-[#e6f4ea] border border-[#217346]/20 rounded-lg p-4 text-center space-y-2">
                      <div className="text-lg" style={{ color: '#137333' }}>✓</div>
                      <p className="text-xs font-medium" style={{ color: '#137333' }}>Request Logged</p>
                      <p className="text-[11px] leading-relaxed font-light" style={{ color: '#137333' }}>
                        Your message has been sent to <span style={{ color: '#D0A511' }}>Info@fantasticlimo.ca</span>. Our coordinator will contact you shortly.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <p className="text-[10px] text-center uppercase tracking-wider" style={{ color: '#6b7280' }}>
                      Or reach us immediately
                    </p>
                    <div className="flex flex-col gap-1 items-center">
                      <a href="tel:+13062404000" className="hover:underline font-bold text-sm tracking-wide" style={{ color: '#D0A511' }}>
                        📞 +1 (306) 240-4000
                      </a>
                      <a href="mailto:info@fantasticlimo.ca" className="hover:text-white text-xs" style={{ color: '#6b7280' }}>
                        ✉️ info@fantasticlimo.ca
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* AI Stage Input Footer */}
            {stage === "ai" && (
              <div className="border-t border-luxury-gold/15 bg-[#fdfbf7] p-3.5 space-y-3" style={{ backgroundColor: '#fdfbf7' }}>
                {/* Suggestions */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                  <button
                    onClick={() => handleQuickQuestion("Tell me about your fleet")}
                    className="flex-shrink-0 bg-white hover:bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-3 py-1 transition-all cursor-pointer"
                    style={{ color: '#000000' }}
                  >
                    🚗 Show Fleet
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("What are the rates per hour?")}
                    className="flex-shrink-0 bg-white hover:bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-3 py-1 transition-all cursor-pointer"
                    style={{ color: '#000000' }}
                  >
                    💰 Get Pricing
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("Tell me about Airport Meet & Greet")}
                    className="flex-shrink-0 bg-white hover:bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-3 py-1 transition-all cursor-pointer"
                    style={{ color: '#000000' }}
                  >
                    ✈️ Airport VIP
                  </button>
                  <button
                    onClick={() => selectPath("live")}
                    className="flex-shrink-0 bg-white hover:bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-3 py-1 transition-all cursor-pointer"
                    style={{ color: '#000000' }}
                  >
                    👤 Live Rep
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about fleet, booking, or security..."
                    className="flex-1 border border-luxury-gold/30 focus:border-luxury-gold rounded px-3 py-2 text-xs focus:outline-none transition-all placeholder:text-gray-400"
                    style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  />
                  <button
                    type="submit"
                    className="bg-luxury-gold hover:brightness-110 p-2 rounded transition-all cursor-pointer flex items-center justify-center w-9 h-9 shrink-0"
                    style={{ color: '#000000' }}
                    aria-label="Send Message"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
