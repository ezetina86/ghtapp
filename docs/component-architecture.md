# Component Hierarchy & Data Flow Architecture

## Component Hierarchy Diagram

```mermaid
graph TD
    A[App.tsx] --> B[Layout]
    B --> C[Header]
    B --> D[Navigation]
    B --> E[Main Content]
    B --> F[Footer]
    
    E --> G[Dashboard]
    E --> H[Books Management]
    E --> I[Reading Sessions]
    E --> J[Goals]
    E --> K[Statistics]
    E --> L[Settings]
    
    G --> G1[Overview Cards]
    G --> G2[Contribution Graph]
    G --> G3[Recent Activity]
    G --> G4[Quick Actions]
    
    H --> H1[Book List]
    H --> H2[Book Details]
    H --> H3[Add Book Form]
    H --> H4[Book Search]
    
    I --> I1[Session List]
    I --> I2[Log Session Form]
    I --> I3[Session Details]
    
    J --> J1[Goals List]
    J --> J2[Create Goal Form]
    J --> J3[Goal Progress]
    
    K --> K1[Statistics Dashboard]
    K --> K2[Reading Streaks]
    K --> K3[Monthly Reports]
    
    L --> L1[Profile Settings]
    L --> L2[Preferences]
    L --> L3[Data Export]
    
    subgraph "UI Components"
        U1[Button]
        U2[Card]
        U3[Modal]
        U4[Form Input]
        U5[Progress Bar]
        U6[Loading Spinner]
        U7[3D Book Card]
        U8[Contribution Heatmap]
    end
    
    H1 --> U2
    G2 --> U8
    H --> U7
    I2 --> U4
    G1 --> U1
```

## Data Flow Diagram

```mermaid
flowchart TD
    A[User Interface] --> B[React Components]
    B --> C[Custom Hooks]
    C --> D[Zustand Store]
    
    D --> E[Backend API]
    E --> F[Express.js Server]
    F --> G[Prisma ORM]
    G --> H[SQLite Database]
    
    B --> I[React Spring Animations]
    I --> J[CSS 3D Transforms]
    
    subgraph "External APIs"
        K[Open Library API]
        L[Google Books API]
    end
    
    E --> K
    E --> L
    
    subgraph "Data Types"
        M[User]
        N[Book]
        O[Reading Session]
        P[Goal]
        Q[Note]
    end
    
    D --> M
    D --> N
    D --> O
    D --> P
    D --> Q
```

## Component Relationship Details

### Layout Components
- **App.tsx**: Root component with routing and global state
- **Layout**: Main layout wrapper with header/footer
- **Navigation**: Sidebar/top navigation with route links

### Page Components
- **Dashboard**: Overview page with stats and quick actions
- **Books**: Book management with list, details, and forms
- **Reading Sessions**: Session logging and history
- **Goals**: Goal setting and progress tracking
- **Statistics**: Detailed analytics and reports
- **Settings**: User preferences and app configuration

### Feature-Specific Components

#### Books Module
```mermaid
graph LR
    A[BookList] --> B[BookCard]
    A --> C[AddBookButton]
    A --> D[BookSearch]
    B --> E[3D Book Visualization]
    B --> F[Progress Indicator]
    D --> G[BookDetails]
    G --> H[BookForm]
```

#### Dashboard Module
```mermaid
graph LR
    A[Dashboard] --> B[OverviewCards]
    A --> C[ContributionGraph]
    A --> D[RecentActivity]
    A --> E[QuickActions]
    C --> F[Heatmap Cell]
    D --> G[Activity Item]
    E --> H[Action Button]
```

### UI Component Library

#### Core UI Components
- **Button**: Primary/secondary variants with neon effects
- **Card**: Glass morphism cards with neon borders
- **Modal**: Overlay dialogs for forms and confirmations
- **Form Input**: Text inputs with validation and neon focus states
- **Progress Bar**: Animated progress indicators with 3D depth
- **Loading Spinner**: Animated loading states

#### Specialized Components
- **3D Book Card**: CSS-transformed book covers with hover effects
- **Contribution Heatmap**: GitHub-style activity grid
- **Streak Counter**: Animated number displays for streaks
- **Goal Progress Ring**: Circular progress indicators

## State Management Architecture

### Zustand Store Structure
```typescript
interface AppState {
  // User State
  user: User | null;
  
  // Books State
  books: Book[];
  currentBook: Book | null;
  searchResults: BookSearchResult[];
  
  // Reading Sessions State
  sessions: ReadingSession[];
  currentSession: ReadingSession | null;
  
  // Goals State
  goals: Goal[];
  activeGoals: Goal[];
  
  // UI State
  theme: 'dark' | 'light';
  isLoading: boolean;
  notifications: Notification[];
  
  // Actions
  actions: {
    // User actions
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    
    // Book actions
    addBook: (book: BookData) => Promise<void>;
    updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
    searchBooks: (query: string) => Promise<BookSearchResult[]>;
    
    // Session actions
    logSession: (session: SessionData) => Promise<void>;
    updateSession: (id: string, updates: Partial<ReadingSession>) => Promise<void>;
    
    // Goal actions
    createGoal: (goal: GoalData) => Promise<void>;
    updateGoalProgress: (id: string, progress: number) => Promise<void>;
    
    // UI actions
    setTheme: (theme: 'dark' | 'light') => void;
    addNotification: (notification: Notification) => void;
  };
}
```

## Component Communication Patterns

### Props Drilling Solution
- Use Zustand for global state management
- Context API for component-specific shared state
- Custom hooks for reusable component logic

### Event Handling
- Parent components pass handler functions as props
- Emit custom events for cross-component communication
- Zustand actions for complex state updates

### Error Boundaries
- Wrap critical components in Error Boundaries
- Provide graceful error fallbacks
- Log errors for debugging

## Performance Optimization

### Component Optimization
- React.memo for pure components
- useMemo for expensive calculations
- useCallback for stable function references
- Lazy loading for route-based code splitting

### State Optimization
- Normalize complex state structures
- Use selectors to prevent unnecessary re-renders
- Implement virtual scrolling for large lists

### 3D Effects Optimization
- CSS transforms over JavaScript animations
- Will-change CSS property for animated elements
- Reduce animation complexity on mobile devices
- Use transform3d for hardware acceleration