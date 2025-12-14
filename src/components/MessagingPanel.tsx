import { useState, useEffect, useRef } from 'react';
import { BaseCrudService } from '@/integrations';
import { Messages, Bookings, Tourists } from '@/entities';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  guideEmail: string;
  bookingId?: string;
  touristEmail?: string;
  touristName?: string;
}

export function MessagingPanel({
  isOpen,
  onClose,
  guideEmail,
  bookingId,
  touristEmail,
  touristName,
}: MessagingPanelProps) {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this conversation
  useEffect(() => {
    if (!isOpen || !touristEmail) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { items } = await BaseCrudService.getAll<Messages>('messages');
        
        // Filter messages for this conversation
        const conversationMessages = items.filter(m => 
          (m.senderEmail === guideEmail && m.receiverEmail === touristEmail) ||
          (m.senderEmail === touristEmail && m.receiverEmail === guideEmail)
        );
        
        // Sort by timestamp
        conversationMessages.sort((a, b) => {
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeA - timeB;
        });
        
        setMessages(conversationMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, guideEmail, touristEmail]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !touristEmail) return;

    try {
      setSending(true);
      await BaseCrudService.create('messages', {
        _id: crypto.randomUUID(),
        senderEmail: guideEmail,
        receiverEmail: touristEmail,
        message: newMessage,
        timestamp: new Date(),
        bookingId: bookingId,
        senderType: 'guide',
      });

      setNewMessage('');
      
      // Fetch updated messages
      const { items } = await BaseCrudService.getAll<Messages>('messages');
      const conversationMessages = items.filter(m => 
        (m.senderEmail === guideEmail && m.receiverEmail === touristEmail) ||
        (m.senderEmail === touristEmail && m.receiverEmail === guideEmail)
      );
      conversationMessages.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeA - timeB;
      });
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary/10 bg-gradient-to-r from-secondary/5 to-transparent">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} className="text-secondary" />
              <div>
                <p className="font-heading font-bold text-secondary text-sm">{touristName || 'Tourist'}</p>
                <p className="font-paragraph text-xs text-foreground/60">{touristEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/10 rounded-lg transition-all"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-paragraph text-foreground/60">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-paragraph text-foreground/60 text-center">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${msg.senderEmail === guideEmail ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.senderEmail === guideEmail
                        ? 'bg-secondary text-white rounded-br-none'
                        : 'bg-secondary/10 text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="font-paragraph text-sm">{msg.message}</p>
                    <p className={`font-paragraph text-xs mt-1 ${
                      msg.senderEmail === guideEmail ? 'text-white/70' : 'text-foreground/60'
                    }`}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : ''}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-secondary/10 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-secondary/20 rounded-full font-paragraph text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="p-2 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
