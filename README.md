# Nthoppa Fintech Platform

## Quick Start

1. Install dependencies:
```
npm install
```

2. Run development server:
```
npm run dev
```

3. Open browser at: http://localhost:3000

## Login Credentials

**Admin Login** (/admin)
- Email: admin@nthoppa.com
- Password: admin123
## Authentication

The application uses JWT-based authentication with bcrypt password hashing.

### Default Admin Account
- Email: admin@nthoppa.com
- Password: Run `npx prisma db seed` to see the generated admin password hash
- You'll need to set the hash in your `.env` file

### Agent Accounts (seeded)
After running `npx prisma db seed`, the following agents are created:
- Agent 1: loginEmail: john.doe@example.com, Password: password123
- Agent 2: loginEmail: jane.smith@example.com, Password: password123
- Agent 3: loginEmail: mike.johnson@example.com, Password: password123
- Agent 4: loginEmail: sarah.williams@example.com, Password: password123

### First-time Setup
1. Copy `.env.example` to `.env` (if you have one)
2. Run `npx prisma generate`
3. Run `npx prisma db push` to create the database
4. Run `npx prisma db seed` to seed initial data
5. Copy the admin bcrypt hash from the seed output into your `.env` file
6. Start the development server with `npm run dev`
## Pages
- / — Public Landing Page
- /login — Agent Login
- /dashboard/main — Agent Dashboard
- /admin — Admin Login
- /admin/dashboard — Admin Dashboard
