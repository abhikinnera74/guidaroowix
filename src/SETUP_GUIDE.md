# Guidaroo Project - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running the Project](#running-the-project)
4. [Troubleshooting](#troubleshooting)
5. [Project Structure](#project-structure)
6. [Features Overview](#features-overview)

---

## Prerequisites

Before you start, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation
Open your terminal/command prompt and run:

```bash
node --version
npm --version
```

Both should return version numbers. If not, reinstall Node.js.

---

## Project Setup

### Step 1: Clone or Extract the Project

**If you have a Git repository:**
```bash
git clone <repository-url>
cd guidaroo
```

**If you have a ZIP file:**
1. Extract the ZIP file to your desired location
2. Open terminal and navigate to the project folder:
```bash
cd path/to/guidaroo
```

### Step 2: Open in VS Code

```bash
code .
```

Or open VS Code manually and use `File > Open Folder` to select the project directory.

### Step 3: Install Dependencies

In the VS Code terminal (or your system terminal), run:

```bash
npm install
```

This will install all required packages listed in `package.json`. This may take 2-5 minutes depending on your internet speed.

**What gets installed:**
- React and React Router
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Zustand (state management)
- And other dependencies

### Step 4: Verify Installation

After installation completes, verify everything is set up correctly:

```bash
npm list
```

You should see a tree of installed packages without errors.

---

## Running the Project

### Step 1: Start the Development Server

In your terminal, run:

```bash
npm run dev
```

You should see output similar to:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 2: Open in Browser

Click the link or manually open your browser and go to:

```
http://localhost:5173/
```

You should see the Guidaroo homepage.

### Step 3: Navigate the Application

**For Tourists:**
1. Click "Tourist Login" to sign in
2. You'll be redirected to the Wix login page
3. After login, you can:
   - Browse guides on "Find a Guide" page
   - Book a guide instantly with "Book Now" button
   - View your bookings on "My Bookings" dashboard
   - Chat with guides after booking
   - See notifications when guides accept your booking

**For Guides:**
1. Click "Guide Login" to sign in
2. After login, you can:
   - View your profile
   - Manage your tours
   - See booking requests
   - Accept/reject bookings
   - Chat with tourists

---

## Troubleshooting

### Issue 1: Port 5173 Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

Then run `npm run dev` again.

### Issue 2: Module Not Found Errors

**Error:** `Cannot find module '@/components/...'`

**Solution:**
1. Make sure you ran `npm install` successfully
2. Check that the file path is correct in the error message
3. Restart the dev server: Press `Ctrl+C` and run `npm run dev` again

### Issue 3: Blank Page or Styling Issues

**Solution:**
1. Clear browser cache: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
2. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. Restart the dev server

### Issue 4: Authentication Not Working

**Solution:**
1. Make sure you're using a valid Wix account
2. Check that the Wix integration is properly configured
3. Check browser console for errors: `F12 > Console tab`

### Issue 5: Chat Box Not Appearing

**Solution:**
1. Make sure you're logged in as a tourist
2. Make sure you have at least one booking
3. Click the "Message" button on a booking card
4. Check browser console for errors

### Issue 6: npm install Fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or use npm 7+ with force flag
npm install --force
```

### Issue 7: Google Maps Not Loading

**Symptoms:**
- Map is blank or shows gray area
- Console shows "Google Maps API error"
- Location picker doesn't work

**Solution:**

1. **Check API Key Configuration**
   ```bash
   # Make sure .env file exists in project root
   cat .env
   # Should show: VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

2. **Verify API Key is Valid**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Check that your API key is active (not disabled)
   - Verify the key has these APIs enabled:
     - Maps JavaScript API
     - Places API
     - Geocoding API

3. **Check API Restrictions**
   - In Google Cloud Console, click on your API key
   - Under "Application restrictions", select "Web"
   - Add your domain to "Allowed referrers"
   - For localhost development, add: `http://localhost:5173/*`

4. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart it
   npm run dev
   ```

5. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache: `Ctrl+Shift+Delete`

6. **Check Browser Console for Errors**
   - Open DevTools: `F12`
   - Go to Console tab
   - Look for error messages starting with "Google Maps"
   - Common errors:
     - `"Google Maps API error: MissingKeyMapError"` → API key is missing or invalid
     - `"Google Maps API error: RefererNotAllowedMapError"` → Domain not allowed
     - `"Google Maps API error: InvalidKeyMapError"` → API key is invalid

7. **Verify Environment Variable is Loaded**
   - In your browser console, type:
     ```javascript
     console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
     ```
   - Should show your API key (not `undefined`)
   - If it shows `undefined`, restart the dev server

8. **Check Network Requests**
   - Open DevTools: `F12`
   - Go to Network tab
   - Look for requests to `maps.googleapis.com`
   - Check if they return 200 (success) or 403 (forbidden)
   - 403 usually means API key issue or domain restriction

9. **Test with a Simple Map**
   - If maps aren't loading anywhere, try the location picker page
   - If it works there but not elsewhere, the issue is component-specific

10. **Last Resort: Regenerate API Key**
    - If nothing works, create a new API key in Google Cloud Console
    - Delete the old one
    - Update `.env` with the new key
    - Restart dev server

**Still Having Issues?**
- Check that you're using the correct environment variable name: `VITE_GOOGLE_MAPS_API_KEY`
- Make sure `.env` file is in the project root (same level as `package.json`)
- Verify no typos in your API key
- Try accessing the app from a different browser
- Check your Google Cloud Console billing is active (even free tier needs billing enabled)

---

## Project Structure

```
guidaroo/
├── src/
│   ├── components/
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── FindGuidePage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   ├── TouristDashboardNewPage.tsx
│   │   │   └── ...
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ChatBox.tsx         # Chat component
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer
│   │   └── Router.tsx          # Route definitions
│   ├── entities/               # TypeScript types
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── styles/                 # Global CSS
│   └── tailwind.config.mjs     # Tailwind configuration
├── integrations/
│   ├── members/                # Authentication
│   ├── cms/                    # Database service
│   └── errorHandlers/          # Error pages
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.mjs         # Tailwind config
└── vite.config.ts              # Vite config
```

---

## Features Overview

### 1. **Tourist Features**

#### Find a Guide
- Browse all available guides
- Filter by city, language, specialty, rating, and price
- View guide details (bio, experience, languages)
- Book instantly with "Book Now" button

#### Booking System
- Select date, time, and duration
- Choose payment method (Cash, Card, or UPI)
- Instant booking confirmation
- Beautiful confirmation screen

#### My Bookings Dashboard
- View all your bookings
- See booking status (Pending, Confirmed, Cancelled)
- View booking details (date, time, guide, price)
- See total spent and confirmed bookings count

#### Notifications
- Receive notifications when guides accept your booking
- View recent notifications on dashboard
- See notification type and date

#### Chat System
- Message guides after booking
- Real-time message updates (polls every 3 seconds)
- See message timestamps
- Chat box appears on booking cards

### 2. **Guide Features**

#### Guide Profile
- Display guide information
- Show ratings and experience
- List specialties and languages
- Display hourly rate

#### Guide Dashboard
- View all booking requests
- Accept or reject bookings
- See booking details
- Manage tours

#### Chat System
- Receive messages from tourists
- Send messages back
- Real-time communication

### 3. **Authentication**

#### Wix Members Integration
- Secure login/logout
- Member profile data
- Email verification
- Session management

#### Protected Routes
- Tourist dashboard requires login
- Booking page requires login
- Guide dashboard requires login
- Automatic redirect to login if not authenticated

### 4. **Database Collections**

#### Bookings
- Stores all booking information
- Tracks booking status
- Records payment method
- Links tourists and guides

#### Guides
- Guide profile information
- Ratings and reviews
- Specialties and languages
- Hourly rates

#### Tourists
- Tourist profile information
- Contact details
- Profile pictures

#### Messages
- Stores all chat messages
- Links to bookings
- Tracks sender and receiver
- Records timestamps

#### Notifications
- Booking acceptance notifications
- New booking notifications
- Notification status (read/unread)
- Booking details in notification

#### Tours
- Tour information
- Descriptions and pricing
- Availability dates
- What's included

#### Guide Reviews
- Review ratings
- Review text
- Reviewer information
- Review dates

---

## Development Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests (if configured)
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

---

## Environment Variables

### Google Maps API Configuration

The project uses Google Maps for location-based features. You need to set up a Google Maps API key.

#### Step 1: Get Your Free Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Maps JavaScript API** - For displaying maps
   - **Places API** - For location search and autocomplete
   - **Geocoding API** - For converting addresses to coordinates
4. Create an API key:
   - Click "Create Credentials" → "API Key"
   - Choose "Restrict Key" → "Web"
   - Add your domain to "Allowed referrers"
5. Copy your API key

#### Step 2: Configure Your Local Environment

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Replace `your_actual_api_key_here` with your actual API key from Google Cloud Console

#### Step 3: Restart Development Server

```bash
npm run dev
```

The development server will automatically pick up the new environment variable.

#### ⚠️ Important Security Notes

- **NEVER commit `.env` to version control** - It contains sensitive credentials
- `.env` is already in `.gitignore` - Make sure not to remove it
- Use `.env.example` as a template for other developers
- For production, set environment variables through your hosting platform's dashboard

#### Free Tier Limits

Google Maps API free tier includes:
- **Maps JavaScript API**: 25,000 map loads/day
- **Places API**: 25,000 requests/day
- **Geocoding API**: 25,000 requests/day

Perfect for development and testing!

### Other Environment Variables

The project uses Wix integration for authentication and database. No additional environment variables are needed for local development beyond the Google Maps API key.

For production deployment, contact your Wix administrator for configuration details.

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Tips

1. **Clear Cache Regularly**
   - Browser cache can cause stale data
   - Use hard refresh: `Ctrl+Shift+R`

2. **Monitor Network**
   - Open DevTools: `F12`
   - Check Network tab for slow requests
   - Check Console for errors

3. **Optimize Images**
   - Use optimized image formats
   - Compress images before uploading

4. **Use Production Build**
   - For testing performance, use `npm run build`
   - Production builds are much faster

---

## Getting Help

### Common Resources
1. **React Documentation**: https://react.dev
2. **Tailwind CSS**: https://tailwindcss.com
3. **Framer Motion**: https://www.framer.com/motion/
4. **Lucide Icons**: https://lucide.dev

### Debugging Tips
1. Open browser DevTools: `F12`
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use React DevTools extension for component debugging

---

## Next Steps

1. **Customize Branding**
   - Update colors in `tailwind.config.mjs`
   - Change logo in `Header.tsx`
   - Update site name

2. **Add More Features**
   - Implement payment gateway integration
   - Add review system
   - Create admin dashboard
   - Add email notifications

3. **Deploy to Production**
   - Build the project: `npm run build`
   - Deploy to hosting service (Vercel, Netlify, etc.)
   - Configure domain and SSL

4. **Monitor and Maintain**
   - Monitor error logs
   - Track user feedback
   - Update dependencies regularly
   - Optimize performance

---

## Support

For issues or questions:
1. Check this guide first
2. Review the troubleshooting section
3. Check browser console for errors
4. Contact your development team

---

**Last Updated:** December 2024
**Version:** 1.0.0
