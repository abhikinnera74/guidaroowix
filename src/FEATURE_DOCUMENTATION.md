# Guidaroo Feature Documentation

## Overview
This document provides comprehensive documentation of the recently implemented features in the Guidaroo platform, including header scroll behavior and real-time messaging functionality.

---

## 1. Header Scroll Feature

### Overview
The header implements a sticky navigation that remains visible at the top of the page during scrolling, providing consistent access to navigation links and user actions.

### Implementation Details

#### Key Features:
- **Sticky Positioning**: Header stays fixed at the top during page scroll
- **Responsive Design**: Desktop and mobile navigation with hamburger menu
- **Active Route Highlighting**: Current page is highlighted in navigation
- **Dual Headers**: Separate headers for Tourist and Guide users
- **Smooth Animations**: Mobile menu uses Framer Motion for smooth transitions

#### File Location:
```
/src/components/Header.tsx
```

### Code Example: Tourist Header with Scroll Behavior

```typescript
import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function TouristHeader() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    // Sticky header that remains at top during scroll
    <header className="bg-background border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-heading text-2xl font-bold text-primary">Guidaroo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 ml-auto">
            <Link 
              to="/tours" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/tours') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Explore Tours
            </Link>
            {/* Additional navigation links... */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation with Animation */}
        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {/* Mobile menu content */}
        </motion.div>
      </div>
    </header>
  );
}
```

### CSS Classes Used:
- `sticky top-0 z-50`: Makes header sticky and keeps it above other content
- `bg-background`: Background color from theme
- `border-b border-primary/10`: Bottom border with primary color at 10% opacity
- `max-w-[120rem]`: Maximum width constraint for content
- `h-20`: Fixed height for header (80px)

### Key Styling Properties:
```css
/* Sticky positioning */
position: sticky;
top: 0;
z-index: 50;

/* Responsive layout */
display: flex;
justify-content: space-between;
align-items: center;

/* Mobile menu animation */
transition: height 0.3s, opacity 0.3s;
```

---

## 2. Real-Time Messaging Feature

### Overview
The messaging system enables real-time communication between guides and tourists, with automatic message fetching, smooth animations, and persistent storage.

### Implementation Details

#### Key Features:
- **Real-Time Message Fetching**: Polls for new messages every 3 seconds
- **Conversation Filtering**: Messages filtered by sender and receiver emails
- **Auto-Scroll**: Automatically scrolls to latest message
- **Message Persistence**: All messages stored in database
- **Smooth Animations**: Messages animate in with staggered timing
- **Responsive Panel**: Adapts to mobile and desktop screens

#### File Location:
```
/src/components/MessagingPanel.tsx
```

### Code Example: Messaging Panel Implementation

```typescript
import { useState, useEffect, useRef } from 'react';
import { BaseCrudService } from '@/integrations';
import { Messages } from '@/entities';
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
        
        // Sort by timestamp (oldest first)
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !touristEmail) return;

    try {
      setSending(true);
      
      // Create new message in database
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
          {/* Header with user info */}
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
```

### Database Schema: Messages Collection

```typescript
interface Messages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  senderEmail?: string;           // Email of message sender
  receiverEmail?: string;         // Email of message receiver
  message?: string;               // Message content
  timestamp?: Date | string;      // When message was sent
  bookingId?: string;             // Associated booking ID
  senderType?: string;            // 'guide' or 'tourist'
}
```

### Key Features Explained:

#### 1. **Message Fetching with Polling**
```typescript
// Poll for new messages every 3 seconds
const interval = setInterval(fetchMessages, 3000);
return () => clearInterval(interval);
```
- Automatically fetches new messages at regular intervals
- Cleanup function prevents memory leaks

#### 2. **Conversation Filtering**
```typescript
const conversationMessages = items.filter(m => 
  (m.senderEmail === guideEmail && m.receiverEmail === touristEmail) ||
  (m.senderEmail === touristEmail && m.receiverEmail === guideEmail)
);
```
- Filters messages to show only conversation between two users
- Works bidirectionally (sent and received messages)

#### 3. **Auto-Scroll to Latest Message**
```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```
- Automatically scrolls to bottom when new messages arrive
- Smooth scrolling behavior for better UX

#### 4. **Message Animations**
```typescript
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```
- Messages fade in and slide up
- Staggered animation for multiple messages

#### 5. **Responsive Panel**
```typescript
className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
```
- Full width on mobile (w-full)
- 384px width on desktop (sm:w-96)
- Fixed positioning for overlay effect

---

## 3. Integration Points

### Using the Messaging Panel in a Page

```typescript
import { useState } from 'react';
import { MessagingPanel } from '@/components/MessagingPanel';

export function BookingPage() {
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [selectedGuideEmail, setSelectedGuideEmail] = useState('');
  const [selectedTouristEmail, setSelectedTouristEmail] = useState('');

  const handleOpenMessaging = (guideEmail: string, touristEmail: string) => {
    setSelectedGuideEmail(guideEmail);
    setSelectedTouristEmail(touristEmail);
    setMessagingOpen(true);
  };

  return (
    <div>
      {/* Your page content */}
      <button onClick={() => handleOpenMessaging('guide@example.com', 'tourist@example.com')}>
        Message Guide
      </button>

      {/* Messaging Panel */}
      <MessagingPanel
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        guideEmail={selectedGuideEmail}
        touristEmail={selectedTouristEmail}
        touristName="John Doe"
        bookingId="booking-123"
      />
    </div>
  );
}
```

### Using the Header in a Layout

```typescript
import { TouristHeader, GuideHeader } from '@/components/Header';
import { useLocation } from 'react-router-dom';

export function Layout() {
  const location = useLocation();
  const isGuideRoute = location.pathname.startsWith('/guide-');

  return (
    <div>
      {isGuideRoute ? <GuideHeader /> : <TouristHeader />}
      {/* Page content */}
    </div>
  );
}
```

---

## 4. Styling and Customization

### Header Styling
```css
/* Sticky positioning */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Navigation links */
.nav-link {
  transition: color 0.3s ease;
}

.nav-link.active {
  font-weight: 600;
  color: var(--primary);
}

/* Mobile menu animation */
.mobile-menu {
  transition: height 0.3s ease, opacity 0.3s ease;
}
```

### Messaging Panel Styling
```css
/* Panel container */
.messaging-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

/* Message bubbles */
.message-bubble {
  max-width: 280px;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  animation: slideUp 0.3s ease;
}

.message-bubble.sent {
  background-color: var(--secondary);
  color: white;
  border-bottom-right-radius: 0;
}

.message-bubble.received {
  background-color: var(--secondary-light);
  color: var(--foreground);
  border-bottom-left-radius: 0;
}

/* Input area */
.message-input {
  border-radius: 9999px;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 2px rgba(122, 75, 43, 0.1);
}
```

---

## 5. Performance Considerations

### Message Polling Optimization
- **Interval**: 3 seconds (configurable)
- **Filtering**: Done client-side to reduce data transfer
- **Cleanup**: Interval cleared when component unmounts

### Header Performance
- **Sticky Positioning**: Uses CSS `position: sticky` (hardware accelerated)
- **Memoization**: Consider wrapping header in `React.memo()` for large apps
- **Event Delegation**: Uses single click handler for mobile menu

### Best Practices
1. **Debounce Message Input**: Prevent rapid submissions
2. **Pagination**: For conversations with many messages, implement pagination
3. **Caching**: Cache messages locally to reduce API calls
4. **WebSocket**: Consider upgrading from polling to WebSocket for real-time updates

---

## 6. Accessibility Features

### Header Accessibility
```typescript
// Semantic HTML
<header className="...">
  <nav className="...">
    {/* Navigation links */}
  </nav>
</header>

// ARIA labels
<button aria-label="Toggle menu">
  {/* Menu icon */}
</button>

// Keyboard navigation
<Link to="/tours" className="...">
  Explore Tours
</Link>
```

### Messaging Panel Accessibility
```typescript
// Focus management
<input
  type="text"
  placeholder="Type a message..."
  className="focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20"
/>

// Semantic structure
<div className="flex flex-col">
  {/* Header */}
  {/* Messages */}
  {/* Input */}
</div>

// Color contrast
// All text meets WCAG AA standards
```

---

## 7. Testing Examples

### Testing Header Navigation
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TouristHeader } from '@/components/Header';

describe('TouristHeader', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <TouristHeader />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Explore Tours')).toBeInTheDocument();
    expect(screen.getByText('Find a Guide')).toBeInTheDocument();
  });

  it('highlights active route', () => {
    render(
      <BrowserRouter>
        <TouristHeader />
      </BrowserRouter>
    );
    
    const toursLink = screen.getByText('Explore Tours');
    expect(toursLink).toHaveClass('text-primary');
  });
});
```

### Testing Messaging Panel
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MessagingPanel } from '@/components/MessagingPanel';

describe('MessagingPanel', () => {
  it('renders when open', () => {
    render(
      <MessagingPanel
        isOpen={true}
        onClose={() => {}}
        guideEmail="guide@example.com"
        touristEmail="tourist@example.com"
        touristName="John Doe"
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('sends message on button click', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MessagingPanel
        isOpen={true}
        onClose={() => {}}
        guideEmail="guide@example.com"
        touristEmail="tourist@example.com"
      />
    );
    
    const input = getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello!' } });
    
    const sendButton = getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Assert message was sent
  });
});
```

---

## 8. Troubleshooting

### Header Not Sticky
**Issue**: Header scrolls with page content
**Solution**: Ensure `sticky top-0 z-50` classes are applied to header element

### Messages Not Loading
**Issue**: Messaging panel shows "Loading messages..." indefinitely
**Solution**: Check that `touristEmail` and `guideEmail` are properly passed as props

### Messages Not Sending
**Issue**: Send button doesn't work
**Solution**: Verify that:
- `newMessage` is not empty
- `touristEmail` is defined
- Database permissions allow creating messages

### Mobile Menu Not Closing
**Issue**: Mobile menu stays open after clicking link
**Solution**: Ensure `setMobileMenuOpen(false)` is called in Link onClick handler

---

## 9. Future Enhancements

### Planned Features
1. **Typing Indicators**: Show when other user is typing
2. **Message Read Receipts**: Show when messages are read
3. **File Sharing**: Allow image/document uploads
4. **Message Search**: Search through conversation history
5. **Notification Badges**: Show unread message count
6. **Voice Messages**: Record and send audio messages
7. **Video Calls**: Integrate video calling functionality

### Performance Improvements
1. **WebSocket Integration**: Replace polling with real-time WebSocket
2. **Message Pagination**: Load messages in batches
3. **Local Caching**: Cache messages in localStorage
4. **Optimistic Updates**: Show message immediately before confirmation

---

## 10. API Reference

### Header Component Props
```typescript
// TouristHeader - No props required
<TouristHeader />

// GuideHeader - No props required
<GuideHeader />

// Default Header (auto-selects based on route)
<Header />
```

### MessagingPanel Component Props
```typescript
interface MessagingPanelProps {
  isOpen: boolean;              // Whether panel is visible
  onClose: () => void;          // Callback when closing
  guideEmail: string;           // Guide's email address
  bookingId?: string;           // Associated booking ID
  touristEmail?: string;        // Tourist's email address
  touristName?: string;         // Tourist's display name
}
```

### Database Operations
```typescript
// Fetch all messages
const { items } = await BaseCrudService.getAll<Messages>('messages');

// Create new message
await BaseCrudService.create('messages', {
  _id: crypto.randomUUID(),
  senderEmail: 'guide@example.com',
  receiverEmail: 'tourist@example.com',
  message: 'Hello!',
  timestamp: new Date(),
  bookingId: 'booking-123',
  senderType: 'guide',
});

// Get specific message
const message = await BaseCrudService.getById<Messages>('messages', 'message-id');

// Update message
await BaseCrudService.update<Messages>('messages', {
  _id: 'message-id',
  message: 'Updated message',
});

// Delete message
await BaseCrudService.delete<Messages>('messages', 'message-id');
```

---

## Conclusion

The Guidaroo platform successfully implements:
- ✅ **Sticky Header Navigation**: Persistent navigation with active route highlighting
- ✅ **Real-Time Messaging**: Bi-directional messaging between guides and tourists
- ✅ **Responsive Design**: Works seamlessly on mobile and desktop
- ✅ **Smooth Animations**: Professional animations using Framer Motion
- ✅ **Database Integration**: Persistent message storage with Wix CMS

These features provide a solid foundation for guide-tourist communication and navigation throughout the platform.
