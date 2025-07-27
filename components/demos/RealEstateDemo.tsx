"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Lead {
  score: number;
  budget: string;
  timeline: string;
  preApproved: boolean;
}

const aiResponses: { [key: string]: { text: string; leadUpdate?: Partial<Lead> } } = {
  "price": {
    text: "I'd be happy to help you find properties in your price range! What's your budget for this home purchase?",
    leadUpdate: { score: 20 }
  },
  "budget": {
    text: "Great! And are you pre-approved for a mortgage, or would you like me to connect you with our lending partners?",
    leadUpdate: { score: 40 }
  },
  "location": {
    text: "We have beautiful properties in several neighborhoods. Are you looking for something specific like good schools, walkability, or proximity to work?",
    leadUpdate: { score: 30 }
  },
  "timeline": {
    text: "Understanding your timeline helps us serve you better. When are you hoping to move into your new home?",
    leadUpdate: { score: 35, timeline: "Analyzing..." }
  },
  "contact": {
    text: "I'll have one of our expert agents reach out within the hour. What's the best phone number to reach you?",
    leadUpdate: { score: 80 }
  }
};

export default function RealEstateDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI real estate assistant. How can I help you find your dream home today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lead, setLead] = useState<Lead>({
    score: 0,
    budget: 'Unknown',
    timeline: 'Unknown',
    preApproved: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowercaseInput = input.toLowerCase();
      let response = aiResponses.price; // default response

      // Match keywords
      if (lowercaseInput.includes('budget') || lowercaseInput.includes('afford')) {
        response = aiResponses.budget;
        // Extract budget if mentioned
        const budgetMatch = lowercaseInput.match(/\$?(\d+)k?/);
        if (budgetMatch) {
          setLead(prev => ({ ...prev, budget: `$${budgetMatch[1]}k` }));
        }
      } else if (lowercaseInput.includes('location') || lowercaseInput.includes('area')) {
        response = aiResponses.location;
      } else if (lowercaseInput.includes('when') || lowercaseInput.includes('timeline')) {
        response = aiResponses.timeline;
      } else if (lowercaseInput.includes('contact') || lowercaseInput.includes('call')) {
        response = aiResponses.contact;
      } else if (lowercaseInput.includes('yes') || lowercaseInput.includes('approved')) {
        setLead(prev => ({ ...prev, preApproved: true, score: prev.score + 20 }));
        response = aiResponses.contact;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Update lead score
      if (response.leadUpdate) {
        setLead(prev => ({
          ...prev,
          ...response.leadUpdate,
          score: Math.min(100, prev.score + (response.leadUpdate?.score || 0))
        }));
      }
    }, 1500);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h4 className="text-lg font-light text-white mb-4">AI Lead Qualification Chatbot</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="md:col-span-2">
          <div className="bg-black rounded-lg border border-zinc-800 h-64 overflow-y-auto p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-800 text-zinc-400 p-3 rounded-lg text-sm">
                    <span className="inline-block animate-pulse">AI is typing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about properties..."
              className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Lead Scoring */}
        <div className="space-y-4">
          <h5 className="text-sm text-zinc-400 uppercase tracking-wider">Lead Intelligence</h5>
          
          {/* Score */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-400 mb-2">Lead Score</div>
            <div className="text-3xl font-light text-white mb-2">{lead.score}%</div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                animate={{ width: `${lead.score}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-2">
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Budget</div>
              <div className="text-sm text-white">{lead.budget}</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Timeline</div>
              <div className="text-sm text-white">{lead.timeline}</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-400">Pre-Approved</div>
              <div className="text-sm text-white">{lead.preApproved ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Quick Responses */}
          <div className="pt-2">
            <div className="text-xs text-zinc-400 mb-2">Quick Responses</div>
            <div className="space-y-1">
              {["What's the price?", "Schedule viewing", "Get pre-approved"].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setInput(quick)}
                  className="w-full text-left text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="text-xs text-purple-400">
          AI analyzes conversation for intent, qualifies leads, and automatically routes hot leads to agents
        </div>
      </div>
    </div>
  );
}