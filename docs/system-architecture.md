# Habit Tracker Application - System Architecture

## Recommended Zero-Cost Tech Stack

Based on your preferences for a beginner/intermediate developer level, simple CSS 3D effects, single-user application, and SQLite simplicity:

### Frontend
- **Framework**: React 18 with TypeScript
  - Mature ecosystem, extensive documentation
  - Excellent for component-based architecture
  - Strong TypeScript support
- **Build Tool**: Vite
  - Lightning fast development server
  - Optimized production builds
  - Perfect for React + TypeScript
- **Styling**: Tailwind CSS + CSS Modules
  - Utility-first approach for rapid development
  - Dark theme + neon colors easily implementable
  - Excellent responsive design utilities
- **3D Effects**: CSS Transforms + React Spring
  - Pure CSS 3D transforms for performance
  - React Spring for smooth animations
  - No complex WebGL dependencies
- **State Management**: Zustand
  - Simple, lightweight state management
  - Perfect for single-user application
  - Minimal boilerplate

### Backend
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js
  - Minimalist and flexible
  - Excellent documentation
  - Large ecosystem
- **Database**: SQLite with Prisma ORM
  - Zero-cost, file-based database
  - Excellent TypeScript support
  - Easy migration and schema management
- **Authentication**: JWT with httpOnly cookies
  - Secure for single-user applications
  - No external auth services needed

### Development & Deployment
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest + React Testing Library + Supertest
- **Code Quality**: ESLint + Prettier + Husky
- **Documentation**: JSDoc + Storybook (optional)

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React +      │    │   (Express +    │    │   (SQLite +     │
│   TypeScript)   │◄──►│   TypeScript)   │◄──►│   Prisma ORM)   │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Pages         │    │ • Routes        │    │ • Books         │
│ • Services      │    │ • Middleware    │    │ • Reading       │
│ • Utils         │    │ • Services      │    │   Sessions      │
│ • Styles        │    │ • Utils         │    │ • Goals         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Book APIs     │◄─────────────┘
                        │ (Free APIs)     │
                        │ • Open Library  │
                        │ • Google Books  │
                        └─────────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20),
  genre VARCHAR(100),
  total_pages INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT,
  description TEXT,
  publisher VARCHAR(255),
  publication_year INTEGER,
  status VARCHAR(20) DEFAULT 'to-read', -- to-read, reading, completed
  current_page INTEGER DEFAULT 0,
  date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_started DATETIME,
  date_completed DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Reading Sessions Table
```sql
CREATE TABLE reading_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  duration_minutes INTEGER,
  pages_read INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

### Goals Table
```sql
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
  target_value INTEGER NOT NULL,
  target_unit VARCHAR(20) NOT NULL, -- minutes, pages, books
  current_progress INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Notes & Highlights Table
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  session_id INTEGER,
  content TEXT NOT NULL,
  page_number INTEGER,
  note_type VARCHAR(20) DEFAULT 'note', -- note, highlight, bookmark
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES reading_sessions(id) ON DELETE SET NULL
);
```

## API Structure

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Books Endpoints
- `GET /api/books` - List user's books (with filters)
- `POST /api/books` - Add new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/search` - Search external book APIs

### Reading Sessions Endpoints
- `GET /api/sessions` - List reading sessions
- `POST /api/sessions` - Log new reading session
- `PUT /api/sessions/:id` - Update reading session
- `DELETE /api/sessions/:id` - Delete reading session

### Goals Endpoints
- `GET /api/goals` - List user's goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Statistics Endpoints
- `GET /api/stats/overview` - Dashboard overview stats
- `GET /api/stats/books` - Book-related statistics
- `GET /api/stats/streaks` - Reading streak data
- `GET /api/stats/contribution-graph` - GitHub-style activity data

### Notes Endpoints
- `GET /api/books/:bookId/notes` - Get book notes
- `POST /api/books/:bookId/notes` - Add new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Development Environment Setup

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### Local Development Commands
```bash
# Start development environment
docker-compose up -d

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development servers
npm run dev:backend
npm run dev:frontend

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
```env
# Backend
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001

# Frontend
VITE_API_URL="http://localhost:3001/api"
VITE_APP_NAME="Habit Tracker"
```

## Security Considerations

- JWT tokens stored in httpOnly cookies
- Input validation using Zod schemas
- SQL injection prevention with Prisma ORM
- XSS protection with Content Security Policy
- Rate limiting on API endpoints
- Environment variable security
- CORS configuration for local development