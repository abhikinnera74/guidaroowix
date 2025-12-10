# Guidaroo - Quick Start Guide (5 Minutes)

## ⚡ TL;DR - Get Running in 5 Steps

### Step 1: Open Terminal in Project Folder
```bash
# Navigate to project directory
cd path/to/guidaroo

# Or open VS Code and use the integrated terminal
```

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ Takes 2-5 minutes (one-time only)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Click the link shown in terminal or go to:
```
http://localhost:5173/
```

### Step 5: Start Using!
- Click "Tourist Login" to sign in
- Browse guides on "Find a Guide"
- Book a guide with "Book Now"
- View bookings on "My Bookings"
- Chat with guides using "Message" button

---

## 🎯 Common Tasks

### Stop the Server
Press `Ctrl+C` in terminal

### Restart the Server
Press `Ctrl+C`, then run `npm run dev` again

### Clear Browser Cache
- **Windows/Linux:** `Ctrl+Shift+Delete`
- **Mac:** `Cmd+Shift+Delete`

### Hard Refresh Page
- **Windows/Linux:** `Ctrl+Shift+R`
- **Mac:** `Cmd+Shift+R`

### Check for Errors
Press `F12` to open Developer Tools → Console tab

---

## 🚀 Features to Try

### As a Tourist:
1. ✅ Browse guides on "Find a Guide"
2. ✅ Filter by city, language, specialty
3. ✅ Click "Book Now" on any guide
4. ✅ Select date, time, duration
5. ✅ Choose payment method (Cash, Card, UPI)
6. ✅ See booking confirmation
7. ✅ View all bookings on "My Bookings"
8. ✅ See notifications when guide accepts
9. ✅ Click "Message" to chat with guide
10. ✅ Send and receive messages in real-time

### As a Guide:
1. ✅ Log in with guide account
2. ✅ View your profile
3. ✅ See booking requests
4. ✅ Accept/reject bookings
5. ✅ Chat with tourists
6. ✅ Manage your tours

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5173 in use | Kill process: `taskkill /PID <PID> /F` (Windows) or `kill -9 <PID>` (Mac) |
| Blank page | Hard refresh: `Ctrl+Shift+R` |
| Module not found | Run `npm install` again |
| Chat not working | Make sure you're logged in and have a booking |
| Notifications not showing | Refresh page, make sure guide accepted booking |
| Styling looks wrong | Clear cache and hard refresh |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/components/Router.tsx` | All routes/pages |
| `src/components/pages/` | Page components |
| `src/components/ChatBox.tsx` | Chat functionality |
| `src/tailwind.config.mjs` | Colors and styling |
| `package.json` | Dependencies |

---

## 🔗 Useful Links

- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev
- **Framer Motion:** https://www.framer.com/motion/

---

## 📚 Full Guides

- **Complete Setup:** See `SETUP_GUIDE.md`
- **Features Details:** See `IMPLEMENTATION_SUMMARY.md`
- **Code Structure:** See project folder structure

---

## ✅ Verification Checklist

After starting the project, verify:
- [ ] Page loads without errors
- [ ] Navigation menu works
- [ ] Can click "Tourist Login"
- [ ] Can browse guides
- [ ] Can see "Book Now" buttons
- [ ] Can click "Find a Guide" link
- [ ] Can see "My Bookings" link (when logged in)
- [ ] Browser console has no red errors

---

## 🎓 Next Steps

1. **Explore the Code:**
   - Open `src/components/Router.tsx` to see all routes
   - Check `src/components/pages/` for page components
   - Review `src/components/ChatBox.tsx` for chat logic

2. **Customize:**
   - Change colors in `src/tailwind.config.mjs`
   - Update logo in `src/components/Header.tsx`
   - Modify text in page components

3. **Deploy:**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or your hosting

---

## 💡 Pro Tips

1. **Use VS Code Extensions:**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Thunder Client (for API testing)

2. **Debug Efficiently:**
   - Use `console.log()` for debugging
   - Check Network tab for API calls
   - Use React DevTools extension

3. **Stay Updated:**
   - Run `npm update` periodically
   - Check for security vulnerabilities: `npm audit`

---

## 🎉 You're Ready!

Your Guidaroo project is now running. Start exploring and building!

**Questions?** Check the full guides or review the code comments.

---

**Last Updated:** December 2024
**Version:** 1.0.0
