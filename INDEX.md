# SupportOS - Complete Project Structure

## 📦 Download Options

1. **Full Project Archive**: `supportos-project.tar.gz` (recommended)
2. **Project Folder**: `supportos-project/` (all files extracted)

---

## 📁 Project Structure

```
supportos-project/
├── 📄 .clinerules              ← Claude Code config (read this first!)
├── 📄 .gitignore               ← Git ignore patterns
├── 📄 package.json             ← Root package with helper scripts
├── 📄 setup.sh                 ← One-command setup script
├── 📖 README.md                ← Full setup guide + API docs
├── 📖 QUICKSTART.md            ← 5-minute getting started
├── 📖 CLAUDE_CODE_GUIDE.md     ← How to use with Claude Code (tikkit)
│
├── 📂 server/                  ← Backend (Node.js + Express)
│   ├── index.js                ← Main API server (30+ endpoints)
│   ├── integrations.js         ← Slack & Email webhook handlers
│   └── package.json            ← Backend dependencies
│
├── 📂 client/                  ← Frontend (React)
│   ├── App.jsx                 ← Complete React app (single file)
│   └── index.html              ← Standalone wrapper
│
└── 📂 docs/                    ← Documentation
    └── INTEGRATION_TESTING.md  ← Testing guide for Slack/Email
```

---

## 🚀 Quick Start

### 1️⃣ Extract & Setup
```bash
tar -xzf supportos-project.tar.gz
cd supportos-project
./setup.sh
```

### 2️⃣ Start Backend
```bash
npm start
# API at http://localhost:3001
```

### 3️⃣ Open Frontend
```bash
open client/index.html
# Login: admin@acme.com / password
```

### 4️⃣ Test Integrations
```bash
npm run test:slack   # Creates Slack ticket
npm run test:email   # Creates Email ticket
```

---

## 📚 Documentation Guide

### Start Here
1. **QUICKSTART.md** - Get running in 5 minutes
2. **README.md** - Complete setup + API reference
3. **CLAUDE_CODE_GUIDE.md** - Using with `claude code` (tikkit)

### Deep Dives
- **.clinerules** - Complete technical documentation
  - Architecture overview
  - API reference (all 30+ endpoints)
  - Database schemas
  - Development guidelines
  - Production deployment checklist
  - Troubleshooting guide

- **docs/INTEGRATION_TESTING.md** - Integration testing
  - Slack webhook testing
  - Email webhook testing
  - Production setup guides
  - Debugging tips

---

## 🎯 What's Included

### Backend Features
✅ JWT authentication with bcrypt
✅ Multi-tenant org isolation
✅ 30+ REST API endpoints
✅ File upload with multer
✅ Slack webhook handler (auto-threading, auto-reply, notifications)
✅ Email webhook handler (SendGrid/Mailgun/Postmark support)
✅ Team invites with role management
✅ Billing with plan tiers
✅ Reports & analytics
✅ Real-time search & filters

### Frontend Features
✅ Complete React app (single file, no build needed)
✅ 4 view modes (Inbox, Kanban, List, Cards)
✅ Floating ticket pane (80% coverage)
✅ Conversation threads (customer/agent/internal notes)
✅ File attachments (upload, download, delete)
✅ Team management UI
✅ Integration configuration UI (12 integrations)
✅ Billing dashboard with plan upgrades
✅ Reports & customer views
✅ Dark control room aesthetic

### Integrations Included
✅ **Slack** - Full webhook handler with threading
✅ **Email** - SendGrid/Mailgun/Postmark support
🔧 **Jira** - Metadata + config UI (handler ready to build)
🔧 **Linear** - Metadata + config UI (handler ready to build)
🔧 **Teams** - Metadata + config UI (handler ready to build)
🔧 **WhatsApp** - Metadata + config UI (handler ready to build)
🔧 **Zoom** - Metadata + config UI (handler ready to build)
🔧 **GitHub** - Metadata + config UI (handler ready to build)
🔧 **Google Calendar** - Metadata + config UI (handler ready to build)
🔧 **PagerDuty** - Metadata + config UI (handler ready to build)
🔧 **Salesforce** - Metadata + config UI (handler ready to build)
🔧 **Zendesk** - Metadata + config UI (handler ready to build)
🔧 **Intercom** - Metadata + config UI (handler ready to build)

---

## 🛠️ Using with Claude Code

### Setup
```bash
cd supportos-project
claude code init
```

### Example Commands
```bash
# Get help
claude code "explain the project architecture"

# Add features
claude code "add a WhatsApp integration following the Slack pattern"

# Fix bugs
claude code "debug why tickets aren't updating in real-time"

# Generate code
claude code "create unit tests for the integration handlers"

# Refactor
claude code "split server/index.js into separate route files"
```

See **CLAUDE_CODE_GUIDE.md** for comprehensive examples and best practices.

---

## 📊 Key Metrics

- **Lines of Code**: ~4,500
- **API Endpoints**: 35+
- **React Components**: 20+
- **Integrations**: 12 (2 fully functional, 10 ready to build)
- **Demo Accounts**: 5 users across 2 orgs
- **Seed Tickets**: 10 realistic tickets

---

## 🔧 Tech Stack

**Backend:**
- Node.js 18+
- Express 4.x
- JWT for auth
- bcryptjs for passwords
- Multer for file uploads
- UUID for ID generation

**Frontend:**
- React 18
- Inline styles (no CSS files)
- Standalone build (no bundler needed)
- DM Sans + DM Mono fonts

**Development:**
- In-memory mock database
- No build step required
- Hot reload with nodemon

---

## 🎓 Next Steps

### Immediate (5 minutes)
1. Extract the archive
2. Run `./setup.sh`
3. Start the backend
4. Open the frontend
5. Test the integrations

### Short Term (1 hour)
1. Read **QUICKSTART.md**
2. Test all features in the UI
3. Run integration tests
4. Explore the codebase
5. Try a few `claude code` commands

### Long Term (ongoing)
1. Add more integration handlers
2. Replace mock DB with PostgreSQL
3. Add WebSocket for real-time
4. Build mobile app
5. Deploy to production

---

## 📞 Support

- **Setup Issues**: Check QUICKSTART.md troubleshooting section
- **Integration Problems**: See docs/INTEGRATION_TESTING.md
- **Development Questions**: Ask `claude code "your question"`
- **Production Deployment**: Review checklist in .clinerules

---

## 📝 Files You Should Read

**Essential (read first):**
- `QUICKSTART.md` - Get running immediately
- `.clinerules` - Complete project documentation

**Important (read soon):**
- `README.md` - Setup guide + API reference
- `CLAUDE_CODE_GUIDE.md` - Using with tikkit

**Reference (as needed):**
- `docs/INTEGRATION_TESTING.md` - Integration testing
- `server/index.js` - Backend implementation
- `client/App.jsx` - Frontend implementation

---

**Ready to start building?** 🚀

```bash
./setup.sh && npm start
```

Then open `client/index.html` in your browser!
