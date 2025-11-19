# Comprehensive Implementation Guide

## Quick Start Instructions

### Prerequisites Setup
1. **Install Required Tools**:
   ```bash
   # Install Node.js 18+ and npm
   # Install Docker Desktop
   # Install Git
   # Install VS Code (recommended)
   
   # Verify installations
   node --version  # Should be 18+
   docker --version
   git --version
   ```

2. **Clone and Setup Project**:
   ```bash
   # Create project directory
   mkdir habit-tracker
   cd habit-tracker
   
   # Initialize Git repository
   git init
   
   # Create basic project structure
   mkdir -p frontend backend docs docker
   touch .gitignore README.md
   ```

3. **Environment Setup**:
   ```bash
   # Copy all provided configuration files
   # Set up Docker environment
   # Configure environment variables
   ```

## Step-by-Step Implementation

### Phase 1: Project Foundation (Week 1)

#### Step 1.1: Initialize React Frontend
```bash
# Create React app with TypeScript and Vite
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install additional dependencies
npm install @tailwindcss/typography @tailwindcss/forms
npm install zustand react-router-dom
npm install @headlessui/react @heroicons/react
npm install react-hook-form @hookform/resolvers zod
npm install axios date-fns
npm install react-spring framer-motion

# Install development dependencies
npm install -D @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint prettier @typescript-eslint/eslint-plugin

# Initialize Tailwind CSS
npx tailwindcss init -p
```

**Tailwind Configuration**:
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f3ff',
          magenta: '#ff00ff',
          lime: '#39ff14',
        },
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff' },
          '100%': { boxShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

#### Step 1.2: Initialize Backend
```bash
# Create backend directory
cd ..
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express cors helmet morgan compression
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install zod express-rate-limit
npm install winston morgan

# Install development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cors
npm install -D ts-node nodemon
npm install -D jest supertest @types/jest
npm install -D eslint prettier @typescript-eslint/eslint-plugin

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

#### Step 1.3: Database Schema Implementation
```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String
  displayName String?
  avatarUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  books       Book[]
  sessions    ReadingSession[]
  goals       Goal[]
  notes       Note[]
  
  @@map("users")
}

model Book {
  id               String   @id @default(cuid())
  userId           String
  title            String
  author           String
  isbn             String?
  genre            String?
  totalPages       Int      @default(0)
  coverUrl         String?
  description      String?
  publisher        String?
  publicationYear  Int?
  status           String   @default("to-read") // to-read, reading, completed
  currentPage      Int      @default(0)
  dateAdded        DateTime @default(now())
  dateStarted      DateTime?
  dateCompleted    DateTime?
  
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions         ReadingSession[]
  notes            Note[]
  
  @@map("books")
}

model ReadingSession {
  id              String   @id @default(cuid())
  userId          String
  bookId          String
  startTime       DateTime
  endTime         DateTime?
  durationMinutes Int      @default(0)
  pagesRead       Int      @default(0)
  notes           String?
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  book            Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  @@map("reading_sessions")
}

model Goal {
  id           String   @id @default(cuid())
  userId       String
  title        String
  description  String?
  goalType     String   // daily, weekly, monthly, yearly
  targetValue  Int
  targetUnit   String   // minutes, pages, books
  currentProgress Int   @default(0)
  startDate    DateTime
  endDate      DateTime?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("goals")
}

model Note {
  id         String   @id @default(cuid())
  userId     String
  bookId     String
  sessionId  String?
  content    String
  pageNumber Int?
  noteType   String   @default("note") // note, highlight, bookmark
  createdAt  DateTime @default(now())
  
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  book       Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  @@map("notes")
}
```

#### Step 1.4: Docker Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: habit-tracker-frontend-dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3001/api
      - NODE_ENV=development
    depends_on:
      - backend
    networks:
      - habit-tracker-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: habit-tracker-backend-dev
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
      - backend_db:/app/db
    environment:
      - DATABASE_URL=file:./dev.db
      - NODE_ENV=development
      - PORT=3001
      - JWT_SECRET=dev-jwt-secret-key-here
    depends_on:
      - database
    networks:
      - habit-tracker-network

  database:
    image: alpine:latest
    container_name: habit-tracker-db-dev
    volumes:
      - backend_db:/app/db
    command: sh -c "echo 'Database volume ready' && tail -f /dev/null"
    networks:
      - habit-tracker-network

volumes:
  backend_db:
    driver: local

networks:
  habit-tracker-network:
    driver: bridge
```

### Phase 2: Core Backend Implementation (Week 2)

#### Step 2.1: Authentication System
```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user as AuthRequest['user'];
    next();
  });
};
```

```typescript
// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, displayName } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName: displayName || username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        createdAt: true,
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

#### Step 2.2: Book Management API
```typescript
// backend/src/controllers/bookController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { author: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { dateAdded: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    res.json({
      books,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      totalPages,
      coverUrl,
      description,
      publisher,
      publicationYear,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const book = await prisma.book.create({
      data: {
        userId,
        title,
        author,
        isbn,
        genre,
        totalPages: totalPages || 0,
        coverUrl,
        description,
        publisher,
        publicationYear: publicationYear ? parseInt(publicationYear) : undefined,
      },
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if book belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = await prisma.book.update({
      where: { id },
      data: updates,
    });

    res.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Phase 3: Frontend Implementation (Week 3)

#### Step 3.1: State Management Setup
```typescript
// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
```

#### Step 3.2: Authentication Components
```typescript
// frontend/src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="bg-dark-800/50 backdrop-blur-lg p-8 rounded-xl border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">HabitFlux</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-dark-700/50 border-neon-cyan/20 focus:border-neon-cyan"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-dark-700/50 border-neon-cyan/20 focus:border-neon-cyan"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
```

#### Step 3.3: Book Components
```typescript
// frontend/src/components/books/BookCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../../types/Book';

interface BookCardProps {
  book: Book;
  onUpdate?: (id: string, updates: Partial<Book>) => void;
  onDelete?: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onUpdate, onDelete }) => {
  const progress = book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'text-neon-cyan';
      case 'completed': return 'text-neon-lime';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        boxShadow: '0 20px 40px rgba(0, 243, 255, 0.1)'
      }}
      className="bg-dark-800/50 backdrop-blur-lg border border-neon-cyan/20 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-neon-cyan/50"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {book.coverUrl ? (
        <div className="aspect-[2/3] mb-4 rounded-lg overflow-hidden">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[2/3] mb-4 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-lg flex items-center justify-center">
          <div className="text-6xl text-neon-cyan/50">📚</div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white line-clamp-2">{book.title}</h3>
        <p className="text-gray-400 text-sm">{book.author}</p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${getStatusColor(book.status)}`}>
            {book.status.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {book.currentPage}/{book.totalPages} pages
          </span>
        </div>

        {book.totalPages > 0 && (
          <div className="w-full bg-dark-700/50 rounded-full h-2 mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-2 rounded-full"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">
            {new Date(book.dateAdded).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            {onUpdate && (
              <button
                onClick={() => onUpdate(book.id, { currentPage: book.currentPage + 10 })}
                className="px-3 py-1 text-xs bg-neon-cyan/20 text-neon-cyan rounded-md hover:bg-neon-cyan/30 transition-colors"
              >
                +10 Pages
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

### Phase 4: Advanced Features (Week 4-5)

#### Step 4.1: Reading Session Tracking
```typescript
// frontend/src/hooks/useReadingSession.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  pagesRead: number;
  notes?: string;
}

interface UseReadingSessionReturn {
  session: ReadingSession | null;
  isActive: boolean;
  elapsedTime: number;
  startSession: (bookId: string) => void;
  endSession: (pagesRead?: number, notes?: string) => void;
  updateSession: (updates: Partial<ReadingSession>) => void;
}

export const useReadingSession = (): UseReadingSessionReturn => {
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { user, token } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session && session.endTime === null) {
      interval = setInterval(() => {
        const start = new Date(session.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session]);

  const startSession = async (bookId: string) => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          startTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSession(newSession);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const endSession = async (pagesRead?: number, notes?: string) => {
    if (!session || !user || !token) return;

    try {
      const endTime = new Date();
      const durationMinutes = Math.floor(elapsedTime / 60);

      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endTime: endTime.toISOString(),
          durationMinutes,
          pagesRead: pagesRead || 0,
          notes,
        }),
      });

      if (response.ok) {
        const updatedSession = await response.json();
        setSession(updatedSession);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const updateSession = (updates: Partial<ReadingSession>) => {
    if (session) {
      setSession({ ...session, ...updates });
    }
  };

  return {
    session,
    isActive: session !== null && session.endTime === null,
    elapsedTime,
    startSession,
    endSession,
    updateSession,
  };
};
```

#### Step 4.2: Statistics Dashboard
```typescript
// frontend/src/components/dashboard/StatsOverview.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Book, ReadingSession } from '../../types/Book';
import { format, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';

interface StatsOverviewProps {
  books: Book[];
  sessions: ReadingSession[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ books, sessions }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Current streak calculation
    const sortedSessions = sessions
      .filter(s => s.endTime)
      .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime());

    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const session of sortedSessions) {
      const sessionDate = format(new Date(session.endTime!), 'yyyy-MM-dd');
      
      if (!lastDate) {
        currentStreak = 1;
        lastDate = new Date(session.endTime!);
      } else {
        const daysDiff = differenceInDays(lastDate, new Date(session.endTime!));
        if (daysDiff <= 1) {
          currentStreak++;
          lastDate = new Date(session.endTime!);
        } else {
          break;
        }
      }
    }

    // Weekly stats
    const weeklySessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const weeklyReadingTime = weeklySessions.reduce((total, session) => total + session.durationMinutes, 0);
    const weeklyPagesRead = weeklySessions.reduce((total, session) => total + session.pagesRead, 0);

    // Total stats
    const totalBooks = books.length;
    const completedBooks = books.filter(book => book.status === 'completed').length;
    const totalReadingTime = sessions.reduce((total, session) => total + session.durationMinutes, 0);

    return {
      currentStreak,
      weeklyReadingTime,
      weeklyPagesRead,
      totalBooks,
      completedBooks,
      totalReadingTime,
    };
  }, [books, sessions]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-dark-800/50 backdrop-blur-lg border border-${color}/20 rounded-xl p-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`text-4xl opacity-50`}>{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Current Streak"
        value={stats.currentStreak}
        icon="🔥"
        color="neon-lime"
      />
      <StatCard
        title="This Week"
        value={`${stats.weeklyReadingTime} min`}
        icon="📚"
        color="neon-cyan"
      />
      <StatCard
        title="Books Read"
        value={`${stats.completedBooks}/${stats.totalBooks}`}
        icon="🎯"
        color="neon-magenta"
      />
    </div>
  );
};
```

## Configuration Files

### Package.json Scripts
```json
// frontend/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}

// backend/package.json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

### Environment Files
```env
# .env.example
# Backend
DATABASE_URL=file:./prod.db
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=HabitFlux
```

## Troubleshooting Guide

### Common Issues & Solutions

#### Docker Issues
```bash
# Port already in use
docker-compose down
docker system prune -f

# Container won't start
docker-compose logs <service-name>
docker-compose down && docker-compose up -d --build

# Database permission issues
docker-compose exec backend chown -R nodejs:nodejs /app/db
```

#### Database Issues
```bash
# Prisma schema changes not reflected
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma db push

# Database corruption
docker-compose exec backend rm -f /app/db/dev.db
docker-compose exec backend npx prisma db push
```

#### Frontend Build Issues
```bash
# TypeScript errors
npm run type-check
npm run lint

# Module resolution issues
rm -rf node_modules package-lock.json
npm install

# Vite cache issues
npm run build -- --force
```

### Performance Optimization Tips

1. **Frontend Optimization**:
   - Use React.memo for expensive components
   - Implement virtual scrolling for large lists
   - Optimize images and use WebP format
   - Code split routes with lazy loading

2. **Backend Optimization**:
   - Add database indexes for frequently queried fields
   - Implement caching for expensive calculations
   - Use pagination for large datasets
   - Optimize database queries with Prisma

3. **Mobile Optimization**:
   - Test 3D effects on actual devices
   - Reduce animation complexity on mobile
   - Implement touch gesture optimizations
   - Optimize bundle size for mobile

## Next Steps & Recommendations

### Immediate Next Steps (Week 6)
1. **Complete Testing**: Implement comprehensive test suite
2. **Performance Testing**: Test on actual mobile devices
3. **User Testing**: Gather feedback from potential users
4. **Documentation**: Complete user manual and API documentation

### Short-term Enhancements (Post-MVP)
1. **Goal System**: Implement goal setting and tracking
2. **Advanced Analytics**: Add detailed statistics and insights
3. **Data Export**: Implement CSV/PDF export functionality
4. **Offline Support**: Add PWA capabilities

### Long-term Roadmap
1. **Multi-habit Tracking**: Expand beyond reading habits
2. **Social Features**: Add progress sharing capabilities
3. **AI Integration**: Intelligent recommendations and insights
4. **Mobile Apps**: Native iOS/Android applications

### Development Best Practices
1. **Code Reviews**: Implement pull request review process
2. **Continuous Integration**: Set up automated testing pipeline
3. **Version Control**: Follow Git flow branching strategy
4. **Documentation**: Keep code documentation up to date
5. **Security**: Regular security audits and updates

This implementation guide provides a comprehensive roadmap for building the HabitFlux application with all the planned features and quality standards. Each step includes practical code examples and configuration files to ensure successful implementation.