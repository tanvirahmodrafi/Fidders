# Local Fit Buddy - AI Agent Instructions

## Project Overview
Local Fit Buddy is a full-stack fitness tracking application built with React/TypeScript frontend and Node.js/Express backend with MySQL database. The app helps users track their fitness journey through comprehensive nutrition logging, body measurements, and progress analytics. Features an integrated Python Flask chatbot API for AI-powered fitness guidance.

## Architecture & Tech Stack

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript, Vite build tool
- **UI Components**: Custom component library in `/src/components/ui/` using shadcn/ui patterns
- **Routing**: React Router for client-side navigation
- **State**: React hooks (useState, useEffect) - no global state management
- **Styling**: Tailwind CSS with custom component styling

### Backend (Node.js + Express)
- **Server**: Express.js with ES6 modules (`import/export`)
- **Database**: MySQL with connection pooling via `mysql2`
- **Auth**: JWT tokens stored in localStorage
- **API Structure**: RESTful routes organized in `/server/routes/`

### Python Chatbot API
- **Framework**: Flask with LangChain integration for OpenAI
- **Location**: `/server/chatbot_api.py` with virtual env in `/server/chatbot_env/`
- **Features**: Persistent chat sessions, fitness/nutrition guidance
- **CORS**: Configured for cross-origin requests from React frontend

### Database Schema
Key tables and relationships:
- `profiles`: User profile data including `calorie` target and `goal` type
- `body_measurements`: Weight and body metrics with `userId` (note: different from `user_id`)
- `daily_logs`: Food intake tracking with nutritional data
- `checkins`: Weekly weight check-ins
- `food_bank`: Master food database for nutrition logging

## Critical Development Patterns

### 1. Database Field Naming Convention
⚠️ **Important**: The codebase has inconsistent field naming:
- Most tables use `user_id` 
- `body_measurements` table uses `userId`
- Always check actual table schema before writing queries

### 2. Authentication Pattern
```javascript
// Standard auth middleware used across all routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### 3. Dynamic Data Fetching Pattern
Pages follow this pattern for real-time data:
```typescript
// Fetch user profile for dynamic targets
const [profile, setProfile] = useState(null);
const fetchProfile = async () => {
  const res = await fetch("/api/dashboard/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  setProfile(await res.json());
};
```

### 4. Macro Calculation System
The app uses goal-based macro calculations:
```typescript
// Central function in DailyLog.tsx
function getMacroPercentages(goalType) {
  const goals = {
    'weight loss': { fat: 25, carbs: 40, protein: 35 },
    'strength training': { fat: 20, carbs: 45, protein: 35 },
    'muscle building': { fat: 20, carbs: 40, protein: 40 },
    'weight gain': { fat: 25, carbs: 50, protein: 25 }
  };
  return goals[goalType?.toLowerCase()] || goals['default'];
}
```

## API Endpoints & Data Flow

### Core Endpoints
- `GET /api/dashboard` - Dashboard summary with calorie targets from profile
- `GET /api/dashboard/profile` - User profile data (calorie, goal, measurements)
- `GET /api/progress` - Weight history and analytics from body_measurements + checkins
- `GET /api/dailylog/food-bank` - Available foods for logging
- `POST /api/dailylog/log` - Submit daily food entries
- `POST /api/chat` - Python Flask chatbot endpoint (port 5001)

### Data Consistency Requirements
- **Calorie targets**: Always fetch from `profile.calorie` with fallback to 2200
- **Current weight**: Priority order: latest body_measurements → latest checkins → profile.weight
- **Goal type**: Use `profile.goal` for macro calculations (normalize to lowercase)

## Component Integration Patterns

### Progress Analytics
The Progress page combines multiple data sources:
```typescript
// Combines body_measurements and checkins for complete weight history
// Handles duplicate dates by preferring body_measurements over checkins
// Calculates weekly pace and adherence statistics
```

### Food Logging Workflow
1. User selects foods from food_bank
2. Adjusts portions (auto-calculates nutrition ratios)
3. Submits to daily_logs with date grouping
4. Updates dashboard calorie consumption

## Development Workflow

### Environment Setup
- **Frontend**: `npm run dev` (Vite dev server on port 8080)
- **Backend**: `npm run dev` in `/server/` (nodemon with Node.js ES modules)  
- **Chatbot**: `python chatbot_api.py` in `/server/` (Flask on port 5001)
- **Database**: MySQL connection via pool in `db.js`
- **Build Tool**: Uses bun.lockb for dependency management alongside npm

### Starting the Full Stack
```bash
# Terminal 1: Frontend (root directory)
npm run dev

# Terminal 2: Node.js Backend
cd server && npm run dev

# Terminal 3: Python Chatbot API
cd server && source chatbot_env/bin/activate && python chatbot_api.py
```

### Adding New Features
1. **Database**: Create/modify tables with consistent naming
2. **Backend**: Add route in `/server/routes/` with authentication
3. **Frontend**: Create/update page component with API integration
4. **Server**: Register new route in `server.js`

### Common Debugging Points
- Check JWT token in localStorage for auth issues
- Verify database field names (user_id vs userId)
- Ensure proper date formatting for MySQL DATE fields
- Test API endpoints independently before frontend integration
- **Chatbot Integration**: Ensure Flask API is running on port 5001 and CORS is configured
- **Python Environment**: Activate virtual env in `/server/chatbot_env/` before running chatbot

### Environment Setup
- Frontend dev server: `npm run dev` (Vite)
- Backend server: Node.js with `--experimental-modules`
- Database: MySQL connection via pool in `db.js`

## Best Practices for AI Agents

1. **Always verify database schema** before writing queries
2. **Use existing authentication patterns** - don't reinvent auth middleware
3. **Follow the macro calculation system** for nutrition features
4. **Maintain data consistency** between dashboard and individual pages
5. **Handle loading and error states** consistently across components
6. **Use TypeScript properly** - the codebase expects typed components

## Key Files to Reference
- `/server/routes/dashboard.js` - Main data aggregation patterns
- `/src/pages/DailyLog.tsx` - Complex form handling and nutrition calculations
- `/server/db.js` - Database connection configuration
- `/src/components/ui/` - Reusable UI component patterns