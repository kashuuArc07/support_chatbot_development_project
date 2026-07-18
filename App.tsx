import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send, Bot, User, Sparkles, Ticket, Star, Menu, X,
  Paperclip, Mic, Smile, CheckCircle2, Clock, Phone,
  MessageSquare, TrendingUp, Users, Zap, ChevronRight, Heart, Shield
} from 'lucide-react';
import {
  Message, Ticket as TicketType, Category, CATEGORIES,
  getBotResponse, generateTicketId, getWelcomeMessage,
} from './aiBrain';

// ============ Typing Indicator Component ============
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
}

// ============ Message Bubble ============
function MessageBubble({ message, onQuickReply }: { message: Message; onQuickReply: (text: string) => void }) {
  const isBot = message.role === 'bot';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-white/40 backdrop-blur border border-white/50 rounded-full px-4 py-1.5 text-xs text-slate-600 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-[fadeSlideIn_0.3s_ease-out]`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[75%] ${isBot ? 'items-start' : 'items-end'} flex flex-col`}>
        <div className={`px-4 py-2.5 shadow-lg rounded-2xl whitespace-pre-wrap ${
          isBot
            ? 'bg-white/80 backdrop-blur-xl border border-white/50 text-slate-800 rounded-tl-none'
            : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-none'
        }`}>
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{
            __html: message.text
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>')
          }} />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
          <Clock className="w-3 h-3" />
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          {!isBot && <CheckCircle2 className="w-3 h-3 text-violet-500" />}
        </div>
        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => onQuickReply(reply)}
                className="text-xs bg-white/60 backdrop-blur border border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full transition-all hover:scale-105"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

// ============ Ticket Modal ============
function TicketModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (t: TicketType) => void }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('technical');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;
    onSubmit({
      id: generateTicketId(),
      subject,
      description,
      category,
      priority,
      status: 'Open',
      createdAt: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">️ Create Support Ticket</h2>
              <p className="text-sm text-slate-500 mt-1">Our team will respond within 24 hours</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Category</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`text-xs px-3 py-2 rounded-lg border transition ${
                      category === c.id
                        ? 'bg-violet-50 border-violet-500 text-violet-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="mr-1">{c.icon}</span>{c.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Priority</label>
              <div className="flex gap-2 mt-1">
                {(['Low', 'Medium', 'High'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-sm py-2 rounded-lg border transition ${
                      priority === p
                        ? p === 'High' ? 'bg-red-50 border-red-500 text-red-700'
                        : p === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!subject.trim() || !description.trim()}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Rating Modal ============
function RatingModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-[scaleIn_0.3s_ease-out]">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You! 🎉</h2>
          <p className="text-slate-600 mb-6">Your feedback helps us serve you better. Have a wonderful day!</p>
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-[scaleIn_0.3s_ease-out]">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Rate Your Experience</h2>
        <p className="text-sm text-slate-500 mb-4">How satisfied are you with ZintBot's assistance?</p>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition hover:scale-125"
            >
              <Star
                className={`w-10 h-10 ${
                  star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Any suggestions? (Optional)"
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-4"
        />

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition">
            Cancel
          </button>
          <button
            onClick={() => { if (rating > 0) setSubmitted(true); }}
            disabled={rating === 0}
            className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-40 hover:shadow-xl transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Main App ============
export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', text: getWelcomeMessage(), timestamp: new Date(), quickReplies: ['Technical issue', 'Track order', 'Billing problem', 'Talk to human'] },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const pendingCount = tickets.filter(t => t.status !== 'Resolved').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const msg = text.trim();
    if (!msg || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: msg,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowCategories(false);

    // Simulate AI thinking delay (800-1800ms for realism)
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      const response = getBotResponse(msg, messages.filter(m => m.role === 'user').length);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
        category: response.category,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleCategoryClick = (cat: typeof CATEGORIES[number]) => {
    setShowCategories(false);
    const botMsg: Message = {
      id: Date.now().toString(),
      role: 'bot',
      text: cat.greeting,
      timestamp: new Date(),
      quickReplies: [
        cat.id === 'technical' ? 'App crashing' : cat.id === 'billing' ? 'Refund request' : cat.id === 'shipping' ? 'Track order' : cat.id === 'returns' ? 'Start return' : cat.id === 'account' ? 'Reset password' : 'Something else',
        'Talk to human',
      ],
      category: cat.id,
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleTicketSubmit = (ticket: TicketType) => {
    setTickets(prev => [...prev, ticket]);
    setShowTicketModal(false);
    const botMsg: Message = {
      id: Date.now().toString(),
      role: 'bot',
      text: `✅ **Ticket Created Successfully!**\n\n️ **Ticket ID:** ${ticket.id}\n📋 **Subject:** ${ticket.subject}\n🏷️ **Category:** ${ticket.category}\n🔴 **Priority:** ${ticket.priority}\n\n📧 Confirmation email sent.\n⏱️ Response expected within 24 hours.\n\nYou'll receive updates via email and SMS. Anything else I can help with?`,
      timestamp: new Date(),
      quickReplies: ['Create another ticket', 'View all tickets', 'Rate this chat', 'Close chat'],
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const quickStats = useMemo(() => ({
    totalConversations: 1,
    avgResponseTime: '1.2s',
    satisfaction: '94%',
    ticketsResolved: resolvedCount,
  }), [resolvedCount]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-300/30 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-300/30 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]"></div>
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite_4s]"></div>

      <div className="relative h-full flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white/60 backdrop-blur-xl border-r border-white/50 flex-shrink-0 overflow-hidden`}>
          <div className="w-80 h-full flex flex-col p-5">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-tight">FlowZint AI</h1>
                <p className="text-xs text-slate-500">Support Assistant 2026</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">Online • Avg response 1.2s</span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quick Actions</p>
              <button
                onClick={() => setShowTicketModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-[1.01] transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span className="text-sm">Create New Ticket</span>
              </button>
              <button
                onClick={() => setShowRating(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Rate This Chat</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-sm">Call Support</span>
              </button>
            </div>

            {/* Stats */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Live Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/80 backdrop-blur border border-white/50 rounded-xl p-3">
                  <MessageSquare className="w-4 h-4 text-violet-500 mb-1" />
                  <p className="text-xl font-bold text-slate-900">{quickStats.totalConversations}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Conversations</p>
                </div>
                <div className="bg-white/80 backdrop-blur border border-white/50 rounded-xl p-3">
                  <Zap className="w-4 h-4 text-amber-500 mb-1" />
                  <p className="text-xl font-bold text-slate-900">{quickStats.avgResponseTime}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Response Time</p>
                </div>
                <div className="bg-white/80 backdrop-blur border border-white/50 rounded-xl p-3">
                  <Heart className="w-4 h-4 text-pink-500 mb-1" />
                  <p className="text-xl font-bold text-slate-900">{quickStats.satisfaction}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Satisfaction</p>
                </div>
                <div className="bg-white/80 backdrop-blur border border-white/50 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                  <p className="text-xl font-bold text-slate-900">{quickStats.ticketsResolved}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Tickets Done</p>
                </div>
              </div>
            </div>

            {/* Active Tickets */}
            {tickets.length > 0 && (
              <div className="flex-1 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Tickets ({pendingCount} open)</p>
                <div className="space-y-2">
                  {tickets.map(t => (
                    <div key={t.id} className="bg-white/80 border border-white/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-violet-600">{t.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          t.priority === 'High' ? 'bg-red-100 text-red-700'
                          : t.priority === 'Medium' ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{t.subject}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500">Created {t.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-slate-200/50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>End-to-end encrypted</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">FlowZint AI Hackathon 2026 • Built with Vibe Coding</p>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-white/50 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 rounded-xl hover:bg-white flex items-center justify-center">
                {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 flex items-center gap-1.5">
                    ZintBot
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </h2>
                  <p className="text-xs text-emerald-600 font-medium">● Online now</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-full px-3 py-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-xs font-semibold text-violet-700">AI-Powered</span>
              </div>
              <button className="w-9 h-9 rounded-xl hover:bg-white flex items-center justify-center">
                <Users className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            {/* Welcome Categories (shown only at start) */}
            {showCategories && (
              <div className="mb-6 animate-[fadeSlideIn_0.5s_ease-out]">
                <p className="text-sm font-semibold text-slate-600 mb-3">💡 What do you need help with?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group bg-white/80 backdrop-blur-xl border border-white/50 hover:border-violet-300 rounded-2xl p-4 text-left transition-all hover:shadow-xl hover:shadow-violet-500/10 hover:scale-[1.02]"
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-700 transition">{cat.label}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        Get started <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} onQuickReply={handleSend} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white/70 backdrop-blur-xl border-t border-white/50 p-4 md:p-6 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
              <div className="flex gap-1">
                <button type="button" className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-500">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-500 hidden sm:flex">
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm placeholder:text-slate-400 max-h-32"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <button
                type="button"
                className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-500 hidden sm:flex"
              >
                <Smile className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              ZintBot can make mistakes. For urgent issues, please <button onClick={() => setShowTicketModal(true)} className="underline hover:text-violet-600">create a ticket</button>.
            </p>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} onSubmit={handleTicketSubmit} />}
      {showRating && <RatingModal onClose={() => setShowRating(false)} />}
    </div>
  );
}
