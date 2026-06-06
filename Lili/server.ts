import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory list of active client connections for Real-Time SSE
let sseClients: express.Response[] = [];

// Helper to broadcast new messaging updates to all active clients
function broadcastUpdate(type: string, data: any) {
  const payload = JSON.stringify({ type, data });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      console.error('Error writing to SSE client:', err);
    }
  });
}

// In-memory conversations model
const initialConversations = [
  {
    id: 'm1',
    senderName: 'ياسين - مضيف شاليه تيكجدا',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'مرحباً أحمد، الشاليه جاهز لاستقبالكم في التاريخ المحدد. تفضل بالاتصال عند وصولك البهو.',
    time: '19:42',
    unread: true,
    conversation: [
      {
        id: 'msg1_1',
        sender: 'user',
        text: 'السلام عليكم أخي ياسين، هل التدفئة المركزية تعمل بشكل جيد في الشاليه؟ الجو بارد جداً هذه الأيام في تيكجدا.',
        time: '16:15',
      },
      {
        id: 'msg1_2',
        sender: 'host',
        text: 'وعليكم السلام ورحمة الله! نعم بكل تأكيد أخي أحمد، التدفئة المركزية تعمل وموقد الحطب التقليدي جاهز ومملوء بحطب البلوط الطبيعي لدفء رائع وسهرة مميزة.',
        time: '16:30',
      },
      {
        id: 'msg1_3',
        sender: 'user',
        text: 'رائع جداً! شكراً جزيلاً لك. سنصل إن شاء الله حوالي الساعة الرابعة مساءً.',
        time: '17:00',
      },
      {
        id: 'msg1_4',
        sender: 'host',
        text: 'مرحباً أحمد، الشاليه جاهز لاستقبالكم في التاريخ المحدد. تفضل بالاتصال عند وصولك البهو.',
        time: '19:42',
      },
    ],
  },
  {
    id: 'm2',
    senderName: 'فاطمة - فيلا زرالدة بمسبح خلفي',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'لقد استلمنا تأكيد حجز المسبح والفيلا ليوم الجمعة. نرجو احترام قواعد الهدوء.',
    time: 'أمس',
    unread: false,
    conversation: [
      {
        id: 'msg2_1',
        sender: 'user',
        text: 'مرحباً فاطمة، هل المسبح خاص ومحجوب تماماً عن الجيران؟',
        time: 'الأحد',
      },
      {
        id: 'msg2_2',
        sender: 'host',
        text: 'أهلاً بك تامر. نعم المسبح خاص بالكامل ومحاط بأسوار عالية لجميع الخصوصية العائلية.',
        time: 'الأحد',
      },
      {
        id: 'msg2_3',
        sender: 'user',
        text: 'ممتاز أختي فاطمة، قمنا بدفع عربون الحجز الآن.',
        time: 'الأمس',
      },
      {
        id: 'msg2_4',
        sender: 'host',
        text: 'لقد استلمنا تأكيد حجز المسبح والفيلا ليوم الجمعة. نرجو احترام قواعد الهدوء.',
        time: 'الأمس',
      },
    ]
  }
];

let conversations = [...initialConversations];

// Simple health check endpoint for proxy and internal diagnostics
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Real-Time Feed APIs
// 1. GET all conversations
app.get('/api/messages', (req, res) => {
  res.json(conversations);
});

// 2. GET single conversation details
app.get('/api/messages/:id', (req, res) => {
  const convo = conversations.find(c => c.id === req.params.id);
  if (!convo) {
    res.status(404).json({ error: 'Conversation not found' });
  } else {
    res.json(convo);
  }
});

// 3. POST send a new message
app.post('/api/messages', (req, res) => {
  const { messageId, text, sender } = req.body;
  if (!messageId || !text) {
    return res.status(400).json({ error: 'Missing messageId or text' });
  }

  let convo = conversations.find(c => c.id === messageId);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!convo) {
    const { senderName, senderAvatar } = req.body;
    convo = {
      id: messageId,
      senderName: senderName || 'مضيف جديد',
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      lastMessage: text,
      time: 'الآن',
      unread: false,
      conversation: []
    };
    conversations.unshift(convo);
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: sender || 'user',
    text,
    time: timeStr
  };

  convo.conversation.push(newMsg);
  convo.lastMessage = text;
  convo.time = 'الآن';
  convo.unread = false;

  // Broadcast update to all client UI frames via SSE
  broadcastUpdate('sync', conversations);

  res.json(convo);

  // Auto AI simulating host responses with delightful realistic local Algerian Arabic vibes
  if (newMsg.sender === 'user') {
    setTimeout(() => {
      const hostReplyOptions = [
        'أهلاً بك أخي وسهلاً، شرفتنا بقدومك، بيتنا بيتك! مرحباً بكم في الجزائر 🇩🇿',
        'سأكون سعيداً جداً بمساعدتك في ذلك وتوفير سبل الراحة. هل تفضل وقت وصول معين؟ ✨',
        'الحمد لله، كل شيء يسير على ما يرام. سأتواصل معك هاتفياً قريباً لتحديد الموقع بدقة.',
        'تأكيد تام، العقار دافئ ومكتمل التجهيزات والإنترنت السريع في انتظاركم 🌟',
        'مرحباً! نعم بكل تأكيد، الخصوصية عائلية ومضمونة مائة بالمائة والموقع هادئ جداً وآمن.'
      ];
      const randomReply = hostReplyOptions[Math.floor(Math.random() * hostReplyOptions.length)];

      const hostMsg = {
        id: `msg_${Date.now() + 1}`,
        sender: 'host' as const,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Ensure finding freshest conversation array reference
      const freshConvo = conversations.find(c => c.id === messageId);
      if (freshConvo) {
        freshConvo.conversation.push(hostMsg);
        freshConvo.lastMessage = hostMsg.text;
        freshConvo.time = 'الآن';
        freshConvo.unread = true;
        // Broadcast the host answer fully real-time
        broadcastUpdate('sync', conversations);
      }
    }, 2500);
  }
});

// 4. SSE Stream endpoint for real-time live synchronization
app.get('/api/messages/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Write connection success payload
  res.write('data: {"type":"connected"}\n\n');

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

async function startServer() {
  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Fallback all unspecified routes to index.html for smooth client-side SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
