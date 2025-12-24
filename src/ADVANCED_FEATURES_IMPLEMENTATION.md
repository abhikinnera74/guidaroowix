# Guidaroo MVP - Advanced Features Implementation Guide

## 🎯 Implementation Overview

This document outlines the implementation of 4 major features for the Guidaroo MVP:

1. **Payment Integration** (Stripe/Wix Payments)
2. **Real-time Messaging** (WebSocket)
3. **Admin Dashboard** (Commission Tracking)
4. **Enhanced Search** (Geolocation Filtering)

---

## 1️⃣ PAYMENT INTEGRATION

### Architecture

```
BookingPage (Tourist)
    ↓
Create Booking (Pending)
    ↓
Payment Modal (Stripe)
    ↓
Process Payment
    ↓
Update Booking Status → Accepted
    ↓
Create Commission Record
```

### Database Schema Addition

**New Collection: `payments`**
```typescript
interface Payments {
  _id: string;
  bookingId: string;           // Reference to bookings
  touristEmail: string;
  guideEmail: string;
  amount: number;              // Total price
  platformFee: number;         // 20% commission
  guideEarnings: number;       // 80% to guide
  paymentMethod: string;       // 'stripe' | 'wix_payments'
  stripePaymentIntentId?: string;
  paymentStatus: string;       // 'pending' | 'succeeded' | 'failed' | 'refunded'
  transactionDate?: Date;
  refundedDate?: Date;
  refundReason?: string;
  _createdDate?: Date;
  _updatedDate?: Date;
}
```

**New Collection: `commissions`**
```typescript
interface Commissions {
  _id: string;
  guideEmail: string;
  guideId: string;             // Reference to guides
  bookingId: string;           // Reference to bookings
  paymentId: string;           // Reference to payments
  amount: number;              // 80% of booking price
  status: string;              // 'pending' | 'paid' | 'processing'
  payoutDate?: Date;
  stripeConnectAccountId?: string;
  _createdDate?: Date;
  _updatedDate?: Date;
}
```

### Implementation Steps

1. Create Payment Modal Component
2. Integrate Stripe SDK
3. Handle Payment Processing
4. Update Booking Status
5. Create Commission Records
6. Add Payment History to Dashboards

---

## 2️⃣ REAL-TIME MESSAGING (WebSocket)

### Architecture

```
Tourist/Guide sends message
    ↓
WebSocket connection
    ↓
Message stored in DB
    ↓
Real-time delivery to recipient
    ↓
Notification triggered
```

### Enhanced Messages Collection

```typescript
interface Messages {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  senderType: string;          // 'guide' | 'tourist'
  message: string;
  timestamp: Date;
  bookingId: string;
  isRead: boolean;             // NEW
  readAt?: Date;               // NEW
  attachments?: string[];      // NEW - file URLs
  messageType: string;         // 'text' | 'image' | 'file' | 'booking_update'
  _createdDate?: Date;
  _updatedDate?: Date;
}
```

### Implementation Steps

1. Set up WebSocket Server (Wix Velo)
2. Create Real-time Message Service
3. Update MessagingPanel Component
4. Add Message Read Receipts
5. Implement Typing Indicators
6. Add Message Notifications

---

## 3️⃣ ADMIN DASHBOARD

### Pages

- `/admin` - Admin login
- `/admin/dashboard` - Main dashboard with analytics
- `/admin/users` - User management
- `/admin/bookings` - Booking oversight
- `/admin/payments` - Payment tracking
- `/admin/commissions` - Commission management
- `/admin/disputes` - Dispute resolution

### Admin Collection

```typescript
interface Admins {
  _id: string;
  email: string;
  memberEmail: string;
  role: string;                // 'super_admin' | 'moderator' | 'finance'
  permissions: string[];       // ['view_payments', 'manage_users', etc]
  isActive: boolean;
  _createdDate?: Date;
  _updatedDate?: Date;
}
```

### Dispute Collection

```typescript
interface Disputes {
  _id: string;
  bookingId: string;
  reportedBy: string;          // 'guide' | 'tourist'
  reporterEmail: string;
  description: string;
  status: string;              // 'open' | 'investigating' | 'resolved' | 'closed'
  resolution?: string;
  refundAmount?: number;
  assignedTo?: string;         // Admin email
  _createdDate?: Date;
  _updatedDate?: Date;
}
```

### Dashboard Metrics

- Total Revenue
- Total Bookings
- Active Users
- Commission Payouts
- Dispute Rate
- Platform Health Score

---

## 4️⃣ ENHANCED SEARCH (Geolocation)

### Architecture

```
User enters location
    ↓
Get coordinates (Geolocation API)
    ↓
Calculate distance to guides
    ↓
Filter by radius (5km, 10km, 25km, etc)
    ↓
Sort by distance + rating
```

### Enhanced Guides Collection

```typescript
interface Guides {
  // ... existing fields ...
  latitude?: number;           // NEW
  longitude?: number;          // NEW
  serviceRadius?: number;      // km - how far they travel
  serviceAreas?: string[];     // Multiple cities/areas
}
```

### Implementation Steps

1. Add Geolocation Fields to Guides
2. Create Location Service
3. Implement Distance Calculation
4. Update FindGuidePage with Map
5. Add Radius Filter
6. Sort Results by Distance

---

## 📊 Implementation Priority

### Phase 1 (Week 1-2): Payment Integration
- [ ] Create Payments collection
- [ ] Create Commissions collection
- [ ] Build Payment Modal
- [ ] Integrate Stripe
- [ ] Update Booking Flow

### Phase 2 (Week 2-3): Real-time Messaging
- [ ] Enhance Messages collection
- [ ] Set up WebSocket
- [ ] Update MessagingPanel
- [ ] Add Read Receipts
- [ ] Implement Notifications

### Phase 3 (Week 3-4): Admin Dashboard
- [ ] Create Admins collection
- [ ] Create Disputes collection
- [ ] Build Admin Pages
- [ ] Add Analytics
- [ ] Implement Dispute Resolution

### Phase 4 (Week 4-5): Enhanced Search
- [ ] Add Geolocation Fields
- [ ] Create Location Service
- [ ] Update FindGuidePage
- [ ] Add Map Integration
- [ ] Implement Radius Filtering

---

## 🔧 Technical Stack

### Payment Processing
- **Stripe** (recommended for international)
- **Wix Payments** (native integration)
- **Stripe Connect** (for guide payouts)

### Real-time Communication
- **WebSocket** (native browser API)
- **Socket.io** (fallback)
- **Wix Velo Backend** (server-side)

### Geolocation
- **Geolocation API** (browser)
- **Google Maps API** (optional - advanced features)
- **OpenStreetMap** (free alternative)

### Admin Dashboard
- **Recharts** (already installed)
- **shadcn/ui** (already installed)
- **React Router** (already installed)

---

## 📝 Next Steps

1. Confirm which payment provider to use (Stripe or Wix Payments)
2. Decide on WebSocket implementation approach
3. Define admin roles and permissions
4. Choose geolocation service (Google Maps, OpenStreetMap, or native API)

Would you like me to proceed with implementing these features?
