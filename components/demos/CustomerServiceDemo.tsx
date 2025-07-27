"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Ticket {
  id: string;
  customer: string;
  issue: string;
  priority: "low" | "medium" | "high";
  status: "new" | "ai-handled" | "escalated";
  category: string;
  sentiment: "positive" | "neutral" | "negative";
}

const incomingTickets: Ticket[] = [
  {
    id: "1",
    customer: "john@company.com",
    issue: "How do I reset my password?",
    priority: "low",
    status: "new",
    category: "Account",
    sentiment: "neutral"
  },
  {
    id: "2",
    customer: "sarah@business.net",
    issue: "My order hasn't arrived and it's been 5 days!",
    priority: "high",
    status: "new",
    category: "Shipping",
    sentiment: "negative"
  },
  {
    id: "3",
    customer: "mike@startup.io",
    issue: "Can I upgrade my subscription plan?",
    priority: "medium",
    status: "new",
    category: "Billing",
    sentiment: "positive"
  },
  {
    id: "4",
    customer: "emma@corp.com",
    issue: "The export feature isn't working properly",
    priority: "medium",
    status: "new",
    category: "Technical",
    sentiment: "neutral"
  }
];

const aiResponses: { [key: string]: string } = {
  "1": "I've sent you a password reset link to your email. It will expire in 24 hours.",
  "2": "I sincerely apologize for the delay. I've prioritized your shipment and you'll receive it within 24 hours with a 20% discount on your next order.",
  "3": "I'd be happy to help you upgrade! I've sent you a comparison of our plans. You can upgrade directly from your dashboard.",
  "4": "I've identified the issue with the export feature. Our team is deploying a fix within the next 2 hours. I'll notify you once it's resolved."
};

export default function CustomerServiceDemo() {
  const [tickets, setTickets] = useState<Ticket[]>(incomingTickets);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    resolved: 0,
    escalated: 0,
    avgTime: "0s"
  });

  const handleProcessTicket = (ticketId: string) => {
    console.log('Processing ticket:', ticketId);
    setProcessingId(ticketId);
    
    // Simulate AI processing
    setTimeout(() => {
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          const shouldEscalate = ticket.priority === "high" && ticket.sentiment === "negative" && Math.random() > 0.7;
          
          if (!shouldEscalate) {
            setStats(prev => ({
              ...prev,
              resolved: prev.resolved + 1,
              avgTime: "12s"
            }));
          } else {
            setStats(prev => ({
              ...prev,
              escalated: prev.escalated + 1,
              avgTime: "8s"
            }));
          }
          
          return {
            ...ticket,
            status: shouldEscalate ? "escalated" : "ai-handled"
          };
        }
        return ticket;
      }));
      setProcessingId(null);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-zinc-400 bg-zinc-500/10";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "😊";
      case "negative": return "😟";
      default: return "😐";
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h4 className="text-lg font-light text-white mb-4">AI Customer Service Automation</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Queue */}
        <div className="lg:col-span-2">
          <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Incoming Support Tickets</h5>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-black rounded-lg border p-4 ${
                  ticket.status === "new" ? "border-zinc-700" : 
                  ticket.status === "ai-handled" ? "border-green-500/30" : 
                  "border-orange-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-white">{ticket.customer}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-xs text-zinc-500">{ticket.category}</span>
                      <span className="text-lg">{getSentimentIcon(ticket.sentiment)}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{ticket.issue}</p>
                  </div>
                  
                  {ticket.status === "new" && (
                    <button
                      onClick={() => handleProcessTicket(ticket.id)}
                      disabled={processingId !== null}
                      className="ml-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {processingId === ticket.id ? "Processing..." : "AI Handle"}
                    </button>
                  )}
                </div>
                
                {/* AI Response */}
                <AnimatePresence>
                  {ticket.status === "ai-handled" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-zinc-800"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-blue-400">AI Response:</span>
                        <p className="text-xs text-zinc-300 flex-1">{aiResponses[ticket.id]}</p>
                      </div>
                      <div className="mt-2 text-xs text-green-400">✓ Resolved automatically</div>
                    </motion.div>
                  )}
                  {ticket.status === "escalated" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-zinc-800"
                    >
                      <div className="text-xs text-orange-400">⚡ Escalated to human agent</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="space-y-4">
          <h5 className="text-sm text-zinc-400 uppercase tracking-wider">AI Performance</h5>
          
          <div className="space-y-3">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-400 mb-1">Tickets Resolved</div>
              <div className="text-2xl text-white">{stats.resolved}</div>
              <div className="text-xs text-green-400 mt-1">by AI automatically</div>
            </div>
            
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-400 mb-1">Tickets Escalated</div>
              <div className="text-2xl text-white">{stats.escalated}</div>
              <div className="text-xs text-orange-400 mt-1">to human agents</div>
            </div>
            
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-400 mb-1">Avg Response Time</div>
              <div className="text-2xl text-white">{stats.avgTime}</div>
              <div className="text-xs text-blue-400 mt-1">vs 2.5 hrs manual</div>
            </div>
          </div>

          {/* Automation Features */}
          <div className="pt-4">
            <div className="text-xs text-zinc-400 mb-2">AI Capabilities</div>
            <div className="space-y-1 text-xs text-zinc-300">
              <div>• Sentiment analysis</div>
              <div>• Auto-categorization</div>
              <div>• Priority detection</div>
              <div>• Smart escalation</div>
              <div>• Multi-language support</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Notice */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="text-xs text-green-400">
          AI handles many common support tickets automatically, reducing response time from hours to seconds
        </div>
      </div>
    </div>
  );
}