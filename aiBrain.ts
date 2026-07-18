// AI Brain for FlowZint Support Chatbot
// Smart rule-based engine with keyword matching and contextual responses

export type Category = 'technical' | 'billing' | 'shipping' | 'returns' | 'general' | 'account';

export interface Message {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  quickReplies?: string[];
  category?: Category;
}

export interface Ticket {
  id: string;
  subject: string;
  category: Category;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: Date;
  description: string;
}

// Category definitions with icons and greetings
export const CATEGORIES: { id: Category; label: string; icon: string; greeting: string }[] = [
  { id: 'technical', label: 'Technical Issue', icon: '🔧', greeting: "🔧 Technical Support — Let's troubleshoot your issue." },
  { id: 'billing', label: 'Billing & Payments', icon: '💳', greeting: "💳 Billing Support — I can help with invoices, refunds, and payments." },
  { id: 'shipping', label: 'Shipping & Delivery', icon: '', greeting: "📦 Shipping Support — Track your order and resolve delivery issues." },
  { id: 'returns', label: 'Returns & Refunds', icon: '↩️', greeting: "↩️ Returns Support — I'll guide you through the return process." },
  { id: 'account', label: 'Account Help', icon: '👤', greeting: "👤 Account Support — Password reset, profile updates, and more." },
  { id: 'general', label: 'General Inquiry', icon: '💬', greeting: " General Help — Ask me anything!" },
];

// Knowledge base: patterns and responses
const RESPONSES: { keywords: string[]; responses: string[]; category: Category; quickReplies?: string[] }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'hlo', 'hii', 'kaise ho', 'kya haal'],
    responses: [
      "Namaste! 🙏 I'm ZintBot, your AI support assistant. How can I help you today?",
      "Hello there! 👋 Welcome to FlowZint Support. What can I assist you with?",
      "Hey! 😊 Great to see you. Choose a category below or tell me your issue directly.",
    ],
    category: 'general',
    quickReplies: ['Track my order', 'Refund issue', 'Reset password', 'Talk to human'],
  },
  {
    keywords: ['password', 'login', 'signin', 'sign in', 'access', 'lock', 'forgot'],
    responses: [
      "🔐 **Password Reset:** I can help you reset your password instantly.\n\n1. Click **'Forgot Password'** on the login screen\n2. Enter your registered email\n3. Check inbox for reset link (expires in 30 min)\n4. Set new password (min 8 chars, with special char)\n\nNeed me to send a reset link to your email?",
      "👤 **Account Access Issue:** Let's get you back in!\n\nIf you're locked out:\n• Wait 15 minutes after 5 failed attempts\n• Clear browser cache & cookies\n• Try incognito mode\n• Reset password using email\n\nWould you like me to escalate this to our security team?",
    ],
    category: 'account',
    quickReplies: ['Send reset link', 'Account locked', '2FA issue', 'Still can\'t login'],
  },
  {
    keywords: ['refund', 'money back', 'paisa', 'refund kar', 'cancel', 'cancellation'],
    responses: [
      "💰 **Refund Process:**\n\n✅ Refunds are processed within **5-7 business days**\n Money returns to original payment method\n Confirmation email sent once initiated\n\n**To start a refund:**\n1. Go to Orders → Select item\n2. Click 'Request Refund'\n3. Select reason\n4. Submit\n\nWant me to create a refund ticket for you?",
      " **Refund Status Check:**\n\nMost refunds complete in **3-7 working days**:\n• UPI: 24-48 hours\n• Credit/Debit Card: 5-7 days\n• Net Banking: 3-5 days\n\nIf not received after 7 days, I'll escalate immediately. Share your order ID?",
    ],
    category: 'billing',
    quickReplies: ['Check refund status', 'Create refund ticket', 'Speak to agent', 'Order ID help'],
  },
  {
    keywords: ['order', 'track', 'delivery', 'kab aayega', 'kab milega', 'shipping', 'courier', 'dispatch'],
    responses: [
      "📦 **Order Tracking:**\n\nShare your **Order ID** (e.g., #FZ-12345) and I'll check the live status.\n\nTypical delivery timeline:\n• ️ Metro cities: 2-3 days\n• 🏘️ Tier-2/3: 4-6 days\n• 🌄 Remote areas: 7-10 days\n\nYou'll get SMS + email updates at each step!",
      "🚚 **Shipment Update:**\n\nYour order goes through:\n1. 📝 Order Confirmed\n2. 📦 Packed & Shipped\n3. 🚛 Out for Delivery\n4. ✅ Delivered\n\nIf delayed beyond estimated date, we offer **free shipping on next order** as apology. Order ID please?",
    ],
    category: 'shipping',
    quickReplies: ['Track order', 'Delayed delivery', 'Wrong address', 'Change delivery date'],
  },
  {
    keywords: ['return', 'exchange', 'bad quality', 'defect', 'kharab', 'galat', 'wrong item', 'damaged'],
    responses: [
      "↩️ **Return Policy:**\n\n✅ **7-day return window** from delivery\n✅ Free pickup from your doorstep\n✅ 100% refund or exchange\n\n**Steps:**\n1. Orders → Select item\n2. 'Return/Replace'\n3. Upload photo (if damaged)\n4. Schedule pickup\n\nPickup within 24 hours in metro cities!",
      " **Exchange Process:**\n\nWrong size/color/defective item?\n\n1. Initiate exchange (free)\n2. Courier picks up old item\n3. New one ships same day\n4. Delivered in 3-5 days\n\n**Note:** Items must be unused with tags for exchange.",
    ],
    category: 'returns',
    quickReplies: ['Start return', 'Schedule pickup', 'Exchange size', 'Damaged item'],
  },
  {
    keywords: ['bill', 'invoice', 'payment', 'pay', 'payment fail', 'upi', 'card fail', 'paisa kata'],
    responses: [
      "💳 **Payment Issue:**\n\nIf payment deducted but order not placed:\n\n1. ⏳ Wait 15-30 min (auto-reversal)\n2.  Check email for order confirmation\n3. 💰 If not reversed in 48h, raise dispute\n\n**Accepted payment methods:**\n• UPI (GPay, PhonePe, Paytm)\n• Credit/Debit Cards\n• Net Banking\n• EMI available",
      " **Invoice Request:**\n\nNeed GST invoice for business?\n\n1. Orders → Select order\n2. 'Download Invoice'\n3. GSTIN added automatically if in profile\n\n**For B2B bulk orders:** Email billing@flowzint.com",
    ],
    category: 'billing',
    quickReplies: ['Payment failed', 'Download invoice', 'UPI issue', 'EMI options'],
  },
  {
    keywords: ['bug', 'error', 'not working', 'crash', 'slow', 'freeze', 'problem', 'issue', ' dikkat', ' dikkat'],
    responses: [
      "🐛 **Technical Issue Report:**\n\nTo help me debug, share:\n1. 📱 Device & OS (e.g., iPhone 14, Android 13)\n2.  Browser/App version\n3. 📸 Screenshot of error (if any)\n4. 🔄 Steps to reproduce\n\n**Quick fixes to try:**\n• Clear app cache\n• Update to latest version\n• Restart device\n• Check internet connection",
      "⚙️ **System Status:**\n\nAll systems operational ✅\n• App: Online\n• Payments: Online\n• API: Online\n• Servers: India (Mumbai, Delhi)\n\nIf specific feature broken, let me know which one and I'll create a high-priority ticket.",
    ],
    category: 'technical',
    quickReplies: ['App crashing', 'Slow performance', 'Feature broken', 'Create bug ticket'],
  },
  {
    keywords: ['human', 'agent', 'representative', 'manager', 'escalate', 'complaint', 'shikayat', 'real person'],
    responses: [
      "🧑‍💼 **Connecting to Live Agent:**\n\nI understand you need human assistance.\n\n **Available hours:** 9 AM - 9 PM IST (Mon-Sat)\n **Avg wait time:** ~3 minutes\n️ **Ticket ID:** Auto-generated\n\nWhile you wait, our AI will pre-load your chat history so the agent has full context. Please stay on this chat.",
      " **Priority Escalation:**\n\nFor urgent issues, I'm connecting you to a senior agent.\n\n📋 **What happens next:**\n1. Ticket created with HIGH priority\n2. Senior agent reviews your case\n3. Callback within 2 hours\n4. Email confirmation sent\n\nYour patience is appreciated! 🙏",
    ],
    category: 'general',
    quickReplies: ['Wait for agent', 'Request callback', 'Email support', 'WhatsApp support'],
  },
  {
    keywords: ['thanks', 'thank you', 'shukriya', 'dhanyavad', 'helpful', 'great', 'awesome', 'mast'],
    responses: [
      "🙏 You're most welcome! Happy to help. Is there anything else I can assist you with today?",
      "😊 Glad I could help! Feel free to reach out anytime. Have a wonderful day!",
      "✨ Awesome! Your satisfaction matters to us. Don't forget to rate this conversation below.",
    ],
    category: 'general',
    quickReplies: ['Rate this chat', 'Start new chat', 'Close chat'],
  },
  {
    keywords: ['bye', 'goodbye', 'exit', 'quit', 'close', 'alvida', 'tata'],
    responses: [
      "👋 Goodbye! Thank you for chatting with FlowZint Support. Your feedback helps us improve. Have a great day!",
      "😊 Alvida! If you need help in future, we're always here. Rating this conversation would mean a lot! ⭐",
    ],
    category: 'general',
  },
  {
    keywords: ['price', 'cost', 'kitna', 'discount', 'offer', 'coupon', 'sale', 'sasta'],
    responses: [
      "️ **Current Offers:**\n\n• 🎟️ **WELCOME10** - 10% off first order\n• 🎉 **FESTIVE25** - 25% off during festivals\n•  **REFER20** - ₹200 off on referrals\n• 💎 **PREMIUM** - Free shipping for members\n\n **Pro tip:** Stack offers with bank cards for extra 5-10% off!",
    ],
    category: 'general',
    quickReplies: ['Apply coupon', 'Refer a friend', 'Premium membership', 'Festival sale'],
  },
];

// Default fallback responses
const FALLBACKS = [
  "Hmm, I'm not quite sure about that. 🤔 Could you rephrase or choose from these options?",
  "I want to make sure I help you correctly. Could you share more details or pick a category?",
  "That's a great question! Let me think... For better help, could you specify if it's about orders, payments, or technical issues?",
  "I didn't catch that.  Try asking in simpler words or tap a quick reply below.",
];

// Find best matching response based on user input
export function getBotResponse(userMessage: string, conversationCount: number): { text: string; quickReplies?: string[]; category: Category } {
  const lowerMsg = userMessage.toLowerCase().trim();

  // Special case: ticket creation keywords
  if (/^(create|open|raise|book)\s*(a\s+)?(ticket|case|complaint)/i.test(lowerMsg)) {
    return {
      text: "🎟️ **Creating Support Ticket:**\n\nPlease provide:\n1. 📋 Brief subject of your issue\n2. 📝 Detailed description\n3. 🏷️ Category (Technical/Billing/Shipping/Returns/Account)\n4. 🔴 Priority (Low/Medium/High)\n\nI'll generate a ticket ID and our team will respond within 24 hours!",
      category: 'general',
    };
  }

  // Search for keyword matches, score by number of matched keywords
  let bestMatch: typeof RESPONSES[number] | null = null;
  let bestScore = 0;

  for (const entry of RESPONSES) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // If match found, return random response from that category
  if (bestMatch && bestScore > 0) {
    const responses = bestMatch.responses;
    const text = responses[Math.floor(Math.random() * responses.length)];
    return {
      text,
      quickReplies: bestMatch.quickReplies,
      category: bestMatch.category,
    };
  }

  // Escalate to human after 3+ unresolved queries
  if (conversationCount >= 3) {
    return {
      text: "🤝 I see this needs more attention. Let me connect you with a **Live Human Agent** who can better assist you.\n\n📞 A senior agent will join this chat in under 2 minutes.\n Confirmation sent to your email.\n\nPlease stay here while we connect you...",
      quickReplies: ['Wait for agent', 'Request callback', 'Cancel'],
      category: 'general',
    };
  }

  // Fallback with suggestions
  const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  return {
    text: fallback,
    quickReplies: ['Technical issue', 'Billing problem', 'Track order', 'Talk to human'],
    category: 'general',
  };
}

// Generate unique ticket ID
export function generateTicketId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'FZ-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Greeting messages
export function getWelcomeMessage(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️ Good morning! Welcome to FlowZint Support. I'm ZintBot, your 24/7 AI assistant. How can I help you today?";
  if (hour < 17) return "🌤️ Good afternoon! Welcome to FlowZint Support. I'm here to help with any questions or issues.";
  if (hour < 21) return "🌆 Good evening! Welcome to FlowZint Support. How can I assist you today?";
  return " Good night! Welcome to FlowZint Support. I'm available 24/7 to help you out.";
}
