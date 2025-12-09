import { useEffect, useState, useRef } from 'react';
import { BaseCrudService } from '@/integrations';
import { Messages } from '@/entities';
import { useMember } from '@/integrations';
import { Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface ChatBoxProps {
  bookingId: string;
  otherUserEmail: string;
  otherUserName: string;
  userType: 'guide' | 'tourist';
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBox({
  bookingId,
  otherUserEmail,
  otherUserName,
  userType,
  isOpen,
  onClose,
}: ChatBoxProps) {
  const { member } = useMember();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && bookingId) {
      loadMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, bookingId]);

  const loadMessages = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Messages>('messages');
      const bookingMessages = items
        .filter(msg => msg.bookingId === bookingId)
        .sort((a, b) => {
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeA - timeB;
        });
      setMessages(bookingMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !member?.loginEmail) return;

    setLoading(true);
    try {
      await BaseCrudService.create('messages', {
        _id: crypto.randomUUID(),
        senderEmail: member.loginEmail,
        receiverEmail: otherUserEmail,
        message: newMessage,
        timestamp: new Date(),
        bookingId: bookingId,
        senderType: userType,
      });

      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-primary/10 flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-primary/5 rounded-t-2xl">
            <div>
              <h3 className="font-heading text-lg font-bold text-primary">{otherUserName}</h3>
              <p className="font-paragraph text-xs text-foreground/70">Booking #{bookingId.slice(0, 8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-paragraph text-sm text-foreground/70 text-center">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderEmail === member?.loginEmail ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderEmail === member?.loginEmail
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white border border-primary/10 text-foreground'
                    }`}
                  >
                    <p className="font-paragraph text-sm break-words">{msg.message}</p>
                    <p className={`font-paragraph text-xs mt-1 ${
                      msg.senderEmail === member?.loginEmail
                        ? 'text-primary-foreground/70'
                        : 'text-foreground/50'
                    }`}>
                      {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/10">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="font-paragraph flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
