# SupportOS — Setup Guide

## Quick Start

### 1. Start the backend

```bash
cd server
npm install
npm start
# API running at http://localhost:3001
```

### 2. Run the frontend

The `supportos.jsx` file is a React artifact — open it in the Claude.ai artifact viewer, or drop it into a Vite/CRA project:

```bash
npm create vite@latest supportos-frontend -- --template react
cd supportos-frontend
# Replace src/App.jsx with supportos.jsx
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Demo Accounts (password: `password`)

| Email | Org | Role |
|-------|-----|------|
| admin@acme.com | Acme Corp (Enterprise) | Admin |
| marcus@acme.com | Acme Corp (Enterprise) | Agent |
| priya@acme.com | Acme Corp (Enterprise) | Agent |
| admin@beta.com | Beta Labs (Pro) | Admin |

---

## API Endpoints

### Auth
- `POST /api/auth/login` — Sign in
- `POST /api/auth/signup` — Create account + org
- `POST /api/auth/invite/accept` — Accept team invite

### Me / Orgs
- `GET /api/me` — Current user + orgs
- `PATCH /api/me` — Update profile
- `POST /api/orgs/switch` — Switch active org

### Tickets
- `GET /api/tickets` — List (supports ?status, ?priority, ?channel, ?q)
- `POST /api/tickets` — Create
- `GET /api/tickets/:id` — Detail + messages + attachments
- `PATCH /api/tickets/:id` — Update any field
- `DELETE /api/tickets/:id` — Delete (admin only)

### Messages
- `GET /api/tickets/:id/messages` — Get thread
- `POST /api/tickets/:id/messages` — Send reply or internal note

### Attachments
- `POST /api/tickets/:id/attachments` — Upload files (multipart)
- `GET /api/tickets/:id/attachments/:attId` — Download file
- `DELETE /api/tickets/:id/attachments/:attId` — Remove

### Team
- `GET /api/team` — Members + pending invites
- `POST /api/team/invite` — Send invite (admin)
- `PATCH /api/team/:userId` — Change role (admin)
- `DELETE /api/team/:userId` — Remove member (admin)
- `DELETE /api/team/invites/:inviteId` — Revoke invite (admin)

### Integrations
- `GET /api/integrations` — Get org integrations
- `POST /api/integrations/:id/connect` — Connect with config
- `PATCH /api/integrations/:id` — Update config
- `DELETE /api/integrations/:id/disconnect` — Disconnect

### Billing
- `GET /api/billing` — Billing info + plans (admin)
- `POST /api/billing/upgrade` — Change plan

### Reports & Customers
- `GET /api/reports/overview` — Analytics overview
- `GET /api/customers` — Customer list

---

## Features Implemented

### Multi-Tenant
- ✅ Login / Signup with org creation
- ✅ Org switcher in sidebar
- ✅ All data scoped per org
- ✅ Team invites with role assignment (Admin / Agent / Viewer)
- ✅ Billing plans (Free / Pro / Business / Enterprise)
- ✅ Seat limits enforced at invite time

### Ticketing
- ✅ Full CRUD with all fields
- ✅ New Ticket modal with custom fields
- ✅ Assign / Reassign modal
- ✅ Status change modal
- ✅ Priority escalation button
- ✅ File attachments (upload, download, delete)
- ✅ Conversation thread (customer / agent / internal notes)
- ✅ SLA tracking
- ✅ Linked issues (Jira / Linear)

### Views
- ✅ Inbox (newest first, unread indicators)
- ✅ Kanban (by status)
- ✅ List (dense table)
- ✅ Cards (visual grid)
- ✅ Filters (priority, channel, status)
- ✅ Real-time search

### Integrations
- ✅ 12 integrations with full connection flows
- ✅ Detailed descriptions + permission scopes
- ✅ Step-by-step setup instructions
- ✅ Config form per integration
- ✅ Connect / Disconnect / Reconfigure

### Reports
- ✅ Ticket volume by status / priority / channel
- ✅ Agent performance stats
- ✅ KPI cards (total, open, resolved, SLA breaches)

---

## Notes
- In-memory DB resets on server restart — swap for PostgreSQL/MongoDB in production
- JWT secret in `index.js` must be changed for production
- File attachments stored in memory — use S3/GCS in production
- Polling every 30s — replace with WebSockets for real-time

---

## Testing Integrations

See `INTEGRATION_TESTING.md` for comprehensive testing guide.

### Quick Test: Simulate incoming Slack message
```bash
curl -X POST http://localhost:3001/api/webhooks/slack/org-1/test \
  -H "Content-Type: application/json" \
  -d '{"text": "Urgent help needed with production issue!"}'
```

### Quick Test: Simulate incoming email
```bash
curl -X POST http://localhost:3001/api/webhooks/email/org-1/test \
  -H "Content-Type: application/json" \
  -d '{"from": "customer@example.com", "subject": "Need help", "text": "System is down!"}'
```

Both commands will create new tickets in org-1 that you can see in the UI.
