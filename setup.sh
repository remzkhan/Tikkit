#!/bin/bash

echo "🚀 SupportOS Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating .env file..."
    cat > server/.env << EOF
PORT=3001
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=development
EOF
    echo "✓ .env file created"
else
    echo "✓ .env file already exists"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "  1. Start the backend:"
echo "     cd server && npm start"
echo ""
echo "  2. Open the frontend:"
echo "     Open client/index.html in your browser"
echo ""
echo "  Demo accounts (password: 'password'):"
echo "     admin@acme.com  - Acme Corp (Enterprise, Admin)"
echo "     marcus@acme.com - Acme Corp (Agent)"
echo "     admin@beta.com  - Beta Labs (Pro, Admin)"
echo ""
echo "  Test integrations:"
echo "     curl -X POST http://localhost:3001/api/webhooks/slack/org-1/test \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"text\": \"Test message!\"}'"
echo ""
