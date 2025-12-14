# Guide Dashboard - Messaging Feature & Header Scroll Implementation

## Overview
This document outlines the new features added to the Guide Dashboard:
1. **Header Hide/Show on Scroll** - Header animates away when scrolling down and returns when scrolling up
2. **Direct Messaging System** - Guides can message tourists directly from the dashboard

---

## Feature 1: Header Hide/Show on Scroll

### How It Works
- When a user scrolls down more than 50px, the header smoothly animates out of view
- When a user scrolls up more than 50px, the header smoothly animates back into view
- Uses `framer-motion` for smooth animations with 0.3s duration

### Implementation Details
**File:** `/src/components/pages/GuideNewDashboardPage.tsx`

```typescript
// State management
const [headerVisible, setHeaderVisible] = useState(true);
const lastScrollRef = useRef(0);

// Scroll event listener
useEffect(() => {
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollRef.current;

    // Hide header when scrolling down more than 50px
    if (scrollDelta > 50 && headerVisible) {
      setHeaderVisible(false);
    }
    // Show header when scrolling up more than 50px
    else if (scrollDelta < -50 && !headerVisible) {
      setHeaderVisible(true);
    }

    lastScrollRef.current = currentScroll;
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [headerVisible]);
```

### Animation
```typescript
<motion.div
  initial={{ y: 0 }}
  animate={{ y: headerVisible ? 0 : -100 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  className="sticky top-0 z-40 bg-background"
>
  <GuidePremiumHeader />
</motion.div>
```

---

## Feature 2: Direct Messaging System

### Components

#### 1. MessagingPanel Component
**File:** `/src/components/MessagingPanel.tsx`

A slide-in panel that appears on the right side of the screen with:
- **Header** - Shows tourist name and email
- **Messages Container** - Displays conversation history with auto-scroll
- **Input Area** - Text input with send button
- **Real-time Updates** - Polls for new messages every 3 seconds

**Features:**
- Smooth slide-in animation from the right
- Message bubbles differentiate between guide (right, secondary color) and tourist (left, light color)
- Timestamps on each message
- Auto-scroll to latest message
- Enter key to send messages
- Loading and empty states

### How to Use

#### Opening a Conversation
Click the "Message" button on any booking card (both pending and confirmed):

```typescript
<button
  onClick={() => handleOpenMessaging(
    booking.touristMemberEmail || booking.touristReference || '',
    tourists[booking.touristReference!]?.firstName || 'Tourist',
    booking._id
  )}
  className="flex-1 px-4 py-2 bg-secondary text-white font-paragraph rounded-full..."
>
  <MessageCircle size={16} />
  Message
</button>
```

#### Closing a Conversation
Click the X button in the top-right corner of the messaging panel.

### Data Storage
Messages are stored in the `messages` collection with the following structure:

```typescript
{
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  timestamp: Date;
  bookingId?: string;
  senderType: 'guide' | 'tourist';
}
```

### Message Flow
1. Guide clicks "Message" button on a booking
2. MessagingPanel opens with tourist's information
3. Existing messages are fetched and displayed
4. Guide types and sends a message
5. Message is saved to the database
6. Panel polls for new messages every 3 seconds
7. New messages appear automatically

---

## UI/UX Details

### Message Bubbles
- **Guide Messages** (Right-aligned)
  - Background: Secondary color (#7A4B2B)
  - Text: White
  - Rounded bottom-right corner removed for visual distinction

- **Tourist Messages** (Left-aligned)
  - Background: Secondary/10 (light brown)
  - Text: Foreground color
  - Rounded bottom-left corner removed for visual distinction

### Panel Styling
- **Width:** Full on mobile, 384px (sm:w-96) on desktop
- **Position:** Fixed, right side of screen
- **Z-index:** 50 (above all other content)
- **Animation:** Slide in from right (300ms)

### Responsive Design
- On mobile: Full-width messaging panel
- On desktop: 384px wide panel on the right side
- Touch-friendly input and buttons

---

## Integration Points

### GuideNewDashboardPage.tsx
The main dashboard page now includes:

1. **State Management**
   ```typescript
   const [messagingOpen, setMessagingOpen] = useState(false);
   const [selectedConversation, setSelectedConversation] = useState<{
     email: string;
     name: string;
     bookingId?: string;
   } | null>(null);
   ```

2. **Handler Function**
   ```typescript
   const handleOpenMessaging = (touristEmail: string, touristName: string, bookingId?: string) => {
     setSelectedConversation({ email: touristEmail, name: touristName, bookingId });
     setMessagingOpen(true);
   };
   ```

3. **MessagingPanel Rendering**
   ```typescript
   {selectedConversation && (
     <MessagingPanel
       isOpen={messagingOpen}
       onClose={() => {
         setMessagingOpen(false);
         setSelectedConversation(null);
       }}
       guideEmail={member?.loginEmail || ''}
       bookingId={selectedConversation.bookingId}
       touristEmail={selectedConversation.email}
       touristName={selectedConversation.name}
     />
   )}
   ```

### Message Buttons
Message buttons are available on:
- **Pending Bookings** - "Message" button (along with Accept/Decline)
- **Active Bookings** - "Message Tourist" button

---

## Future Enhancements

1. **Real-time Updates** - Replace polling with WebSocket for instant messages
2. **Message Notifications** - Add badge count for unread messages
3. **Message History** - Add a dedicated messages page to view all conversations
4. **Typing Indicators** - Show when the other person is typing
5. **File Sharing** - Allow guides and tourists to share images/documents
6. **Message Search** - Search through message history
7. **Conversation List** - Show all active conversations in a sidebar

---

## Testing Checklist

- [ ] Header hides when scrolling down 50px+
- [ ] Header shows when scrolling up 50px+
- [ ] Message button opens messaging panel
- [ ] Messages display correctly (guide on right, tourist on left)
- [ ] New messages can be sent with Enter key
- [ ] New messages can be sent with Send button
- [ ] Messages auto-scroll to bottom
- [ ] Panel closes when X button is clicked
- [ ] Tourist name and email display correctly
- [ ] Timestamps display in correct format
- [ ] Empty state shows when no messages
- [ ] Loading state shows while fetching
- [ ] Messages persist after closing and reopening panel
- [ ] Multiple conversations work independently

---

## Technical Stack

- **React Hooks:** useState, useEffect, useRef
- **Animation:** framer-motion (motion, AnimatePresence)
- **Database:** BaseCrudService (messages collection)
- **Icons:** lucide-react (MessageCircle, Send, X)
- **Styling:** Tailwind CSS

---

## Files Modified/Created

### Created
- `/src/components/MessagingPanel.tsx` - New messaging panel component

### Modified
- `/src/components/pages/GuideNewDashboardPage.tsx` - Added header scroll logic and messaging integration

---

## Notes

- Messages are polled every 3 seconds for real-time feel
- All messages are stored with timestamps for proper ordering
- Guide email is automatically determined from the logged-in member
- Tourist email is extracted from booking data
- Messages are filtered by sender/receiver email pairs to show only relevant conversations
