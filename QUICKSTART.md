# SupportOS - Quickstart Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
./setup.sh
```

Or manually:
```bash
cd server
npm install
```

### 2. Start Backend
```bash
cd server
npm start
```

You should see:
```
🚀 SupportOS API running at http://localhost:3001

Demo accounts (password: "password"):
  admin@acme.com  — Acme Corp (Enterprise, Admin)
  marcus@acme.com — Acme Corp (Enterprise, Agent)
  admin@beta.com  — Beta Labs (Pro, Admin)
```

### 3. Open Frontend

**Option A: Standalone (easiest)**
```bash
# Just open in browser:
open client/index.html
# or
firefox client/index.html
```

**Option B: With local server**
```bash
cd client
python3 -m http.server 8080
# Open http://localhost:8080
```

### 4. Login
- Open the app
- Click a demo account or enter:
  - Email: `admin@acme.com`
  - Password: `password`

---

## ⚡ Test Integrations

### Slack Test
```bash
curl -X POST http://localhost:3001/api/webhooks/slack/org-1/test \
  -H "Content-Type: application/json" \
  -d '{
    "text": "URGENT: Production database is down! Getting 500 errors."
  }'
```

**Result:** New ticket created with:
- Channel: Slack
- Priority: Critical (auto-detected from "URGENT")
- Customer: Slack User U123ABC

### Email Test
```bash
curl -X POST http://localhost:3001/api/webhooks/email/org-1/test \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Jane Customer <jane@bigcorp.com>",
    "subject": "Payment processing failing",
    "text": "Our payment gateway has been returning errors for the past hour. This is extremely urgent!"
  }'
```

**Result:** New ticket created with:
- Channel: Email
- Priority: Critical (keywords detected)
- Customer: Jane Customer
- Auto-reply sent

### View New Tickets
1. Refresh the UI (or wait ~30 seconds for auto-refresh)
2. New tickets appear in Inbox
3. Click to open floating pane
4. Try replying (check server console for outgoing messages)

---

## 🎯 Key Features to Try

### Create a Ticket
1. Click **"+ New Ticket"** button
2. Fill in title, channel, priority
3. Optionally assign to agent
4. Add customer info and tags
5. Write initial message
6. Click **"Create Ticket"**

### Reply to Customer
1. Open any ticket
2. Type your reply in the bottom text box
3. Toggle between "Reply to Customer" and "Internal Note"
4. Click **"Send ↑"** or press ⌘+Enter
5. Check server logs - reply sent via original channel (Slack/Email)

### Assign & Change Status
1. Open ticket
2. Click **"Assign"** → select agent from visual list
3. Click **"Status"** → change to Pending/Resolved/etc
4. Click **"Priority"** → cycle through priorities
5. Click **"Escalate"** → instant Critical priority

### Upload Attachments
1. Open ticket → **Attachments** tab
2. Drag & drop files or click to browse
3. Files appear immediately
4. Click **"↓ Download"** to download
5. Click **"✕"** to delete

### Search & Filter
1. Use search bar: search by ticket ID, title, or customer
2. Click **"⚙ Filter"** button
3. Filter by Priority, Channel, Status
4. Results update live

### Switch Views
1. Top bar: Click **Inbox** / **Kanban** / **List** / **Cards**
2. Kanban: Drag cards between columns (visual only for now)
3. List: Dense table view with all columns
4. Cards: Visual grid with hover effects

### Team Management (Admin Only)
1. Sidebar → **Settings**
2. Select **Team & Roles**
3. Click **"+ Invite Member"**
4. Enter email and select role (Admin/Agent/Viewer)
5. Copy invite link or send via email
6. Change member roles or remove them

### Billing (Admin Only)
1. Settings → **Billing**
2. Toggle Monthly/Annual
3. View plan comparison
4. Click **"Upgrade"** on any plan
5. See invoice history

### Integrations
1. Settings → **Integrations**
2. Browse 12 integrations across 4 categories
3. Click **"+ Connect"** on any integration
4. View **"Connection Steps"** tab for setup guide
5. Fill config form and click **"Connect"**
6. Slack and Email are pre-connected for Acme Corp

---

## 📊 Reports & Analytics

1. Sidebar → **Reports**
2. View overview cards: Total, Open, Resolved, Avg Response Time
3. See breakdowns by Status, Priority, Channel
4. Agent performance stats with open/resolved counts
5. 14-day volume chart (simulated data)

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check Node version (need 18+)
node -v

# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install
```

### Frontend shows blank page
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab - is API reachable?
4. Try different browser
5. Make sure backend is running on port 3001

### Can't login
- Password is literally `password` (lowercase)
- Check Network tab - is POST to /api/auth/login returning 200?
- Clear sessionStorage: `sessionStorage.clear()` in console
- Try signup flow instead

### Webhooks not working
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test with /test endpoints (always work)
curl -X POST http://localhost:3001/api/webhooks/slack/org-1/test \
  -d '{"text": "test"}'

# Check server logs for errors
```

### Token expired
- Tokens last 7 days
- Log out and log back in
- Or clear sessionStorage and re-login

---

## 🎓 Next Steps

1. **Read full docs:** Check `README.md` and `.clinerules`
2. **Test all integrations:** See `docs/INTEGRATION_TESTING.md`
3. **Production setup:** Review deployment checklist in `.clinerules`
4. **Add features:** Use Claude Code to build on top of this foundation

---

## 📚 File Reference

- `.clinerules` - Complete technical documentation
- `README.md` - Setup and API reference
- `docs/INTEGRATION_TESTING.md` - Integration testing guide
- `server/index.js` - Main backend with all routes
- `server/integrations.js` - Slack & Email webhook handlers
- `client/App.jsx` - Complete React application

---

## 🆘 Common Questions

**Q: Is data persisted?**
A: No, in-memory DB resets on server restart. Use PostgreSQL for production.

**Q: Can I use this in production?**
A: Not yet. Review production checklist in `.clinerules` first.

**Q: How do I add more integrations?**
A: See "Adding New Integrations" section in `.clinerules`

**Q: Can I modify the UI?**
A: Yes! Edit `client/App.jsx` - it's a single self-contained React file.

**Q: Real-time updates?**
A: Currently polls every 30s. Add WebSocket for true real-time.

**Q: How do I deploy this?**
A: Backend → Heroku/Railway/Fly.io, Frontend → Vercel/Netlify/S3

---

**Need help?** Check `.clinerules` for comprehensive documentation or use Claude Code: `claude code "help me with X"`
