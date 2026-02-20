# Using SupportOS with Claude Code (tikkit)

## Quick Setup

### 1. Extract the Project
Download `supportos-project.tar.gz` and extract it, or download the `supportos-project/` folder directly.

```bash
# If you have the tarball:
tar -xzf supportos-project.tar.gz
cd supportos-project

# Or just cd into the downloaded folder:
cd supportos-project
```

### 2. Run Setup
```bash
./setup.sh
```

This installs all dependencies and creates a `.env` file.

### 3. Start Development
```bash
# Start the backend
npm start

# In another terminal, open the frontend
open client/index.html
```

---

## Using Claude Code

### Initialize Claude Code
```bash
# Inside the project directory
claude code init
```

Claude Code will read the `.clinerules` file automatically and understand the entire project structure.

### Common Claude Code Commands

**Ask for help:**
```bash
claude code "explain how the Slack integration works"
```

**Add a new feature:**
```bash
claude code "add a WhatsApp integration handler similar to Slack"
```

**Fix a bug:**
```bash
claude code "the ticket status isn't updating properly, can you debug?"
```

**Generate tests:**
```bash
claude code "create unit tests for the integration handlers"
```

**Refactor code:**
```bash
claude code "extract the authentication middleware into a separate file"
```

**Add documentation:**
```bash
claude code "add JSDoc comments to all functions in server/index.js"
```

---

## Project Context for Claude Code

The `.clinerules` file contains comprehensive documentation that Claude Code will use:

- **Architecture Overview** - Multi-tenant structure, tech stack
- **File Structure** - What each file/directory contains
- **API Reference** - All 30+ endpoints documented
- **Database Schema** - Data models explained
- **Development Guidelines** - Code style, patterns, conventions
- **Integration Guides** - How to add new integrations
- **Production Checklist** - Deployment requirements

Claude Code automatically reads this on every invocation, so it always has full context.

---

## Example Workflows

### 1. Add a New Integration
```bash
claude code "Add a Microsoft Teams integration:
- Create TeamsIntegration class in server/integrations.js
- Add webhook handler route
- Add to INTEGRATION_META in client
- Update seed data with Teams config for org-1
Follow the same pattern as SlackIntegration"
```

Claude Code will:
1. Read the `.clinerules` to understand the integration pattern
2. Look at SlackIntegration as a template
3. Create the new TeamsIntegration class
4. Add the webhook route
5. Update the frontend metadata
6. Update the seed data

### 2. Fix a Performance Issue
```bash
claude code "The tickets list is slow when there are 1000+ tickets. 
Can you add pagination to the GET /api/tickets endpoint?"
```

Claude Code will:
1. Find the relevant code in server/index.js
2. Add pagination parameters (page, limit)
3. Update the query logic
4. Return metadata (total, hasMore, etc.)
5. Update the API reference in .clinerules

### 3. Add Real-Time Updates
```bash
claude code "Replace the 30-second polling with WebSocket for real-time ticket updates"
```

Claude Code will:
1. Install socket.io
2. Set up WebSocket server
3. Update frontend to use WebSocket
4. Emit events on ticket changes
5. Update documentation

### 4. Create Database Migration
```bash
claude code "Create a PostgreSQL schema migration for the current in-memory data structure"
```

Claude Code will:
1. Read the database schema from .clinerules
2. Generate SQL CREATE TABLE statements
3. Add foreign keys and indexes
4. Create a migration file
5. Update deployment docs

---

## Best Practices

### 1. Be Specific
❌ "Add error handling"
✅ "Add try-catch error handling to all async functions in server/integrations.js with proper error messages"

### 2. Reference Existing Code
❌ "Create a webhook handler"
✅ "Create a webhook handler for WhatsApp following the same pattern as SlackIntegration.handleWebhook"

### 3. Provide Context
❌ "Fix the bug"
✅ "When I try to upload a file larger than 5MB, the request fails. Can you update the multer config in server/index.js to support 20MB files?"

### 4. Ask for Explanations
```bash
claude code "explain how the JWT authentication works in server/index.js"
claude code "document the ticket threading logic in EmailIntegration"
```

### 5. Iterate
```bash
# First iteration
claude code "add a dashboard page"

# See the result, then refine
claude code "make the dashboard responsive and add dark mode styling"

# Continue iterating
claude code "add date range filters to the dashboard"
```

---

## Working with Files

### View File Contents
```bash
claude code "show me the integration handler for Slack"
```

### Edit Specific Functions
```bash
claude code "in server/index.js, update the POST /api/tickets endpoint to validate required fields"
```

### Create New Files
```bash
claude code "create a new file server/middleware/auth.js and move all auth functions there"
```

### Refactor Across Files
```bash
claude code "split server/index.js into separate route files:
- routes/auth.js
- routes/tickets.js  
- routes/team.js
- routes/integrations.js"
```

---

## Testing with Claude Code

### Generate Tests
```bash
claude code "create Jest tests for the Slack integration webhook handler"
```

### Run and Debug Tests
```bash
# Run tests first
npm test

# If tests fail:
claude code "The Slack webhook tests are failing with 'TypeError: Cannot read property threadMap'. Can you fix this?"
```

### Generate Test Data
```bash
claude code "create a test data generator that seeds the database with 100 realistic tickets"
```

---

## Tips & Tricks

### 1. Use the Project Context
Claude Code always has the full `.clinerules` file in context, so you don't need to explain the architecture:

```bash
# No need to say "this is a multi-tenant app with JWT auth..."
# Just ask directly:
claude code "add a new org creation endpoint"
```

### 2. Reference Multiple Files
```bash
claude code "update both server/index.js and client/App.jsx to support ticket tags with autocomplete"
```

### 3. Get Documentation
```bash
claude code "create API documentation for all endpoints in OpenAPI 3.0 format"
```

### 4. Code Review
```bash
claude code "review server/integrations.js for security issues and best practices"
```

### 5. Generate Examples
```bash
claude code "create example curl commands for all the webhook endpoints"
```

---

## Common Issues

### "Claude Code not finding files"
Make sure you're in the project root directory with `.clinerules` file present.

### "Changes not applying"
Claude Code shows you the changes in the terminal. You need to accept them by typing `yes` or `y`.

### "Context too large"
The full app fits in Claude's context. If you hit limits, focus on specific files:
```bash
claude code "only modify server/index.js - add rate limiting middleware"
```

### "Want to undo changes"
Use git:
```bash
git checkout server/index.js
```

---

## Next Steps

1. ✅ Run `./setup.sh`
2. ✅ Start the backend: `npm start`
3. ✅ Open the frontend: `open client/index.html`
4. ✅ Test integrations: `npm run test:slack`
5. 🚀 Start building with Claude Code!

Example first task:
```bash
claude code "walk me through the codebase and explain the key components"
```

---

**Pro Tip:** Keep the QUICKSTART.md, README.md, and docs/INTEGRATION_TESTING.md open in your editor while working with Claude Code. You can reference them in your prompts:

```bash
claude code "following the pattern in docs/INTEGRATION_TESTING.md, create tests for the email integration"
```
