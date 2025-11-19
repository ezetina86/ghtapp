# Project Structure Rules

## Directory Organization
```
habit-tracker/
├── backend/                  # Server-side application
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/          # Data models and schemas
│   │   ├── routes/          # API endpoint definitions
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   └── database/        # Database configuration
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/                 # Client-side application
│   ├── src/
│   │   ├── components/      # React/Vue components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS/SCSS files
│   │   ├── assets/          # Images, fonts, etc.
│   │   └── services/        # API communication
│   ├── public/              # Static assets
│   └── package.json
├── docker/                   # Docker configurations
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── docs/                     # Documentation
└── README.md
```

## Naming Conventions
- **Files**: kebab-case (user-profile, book-details)
- **Components**: PascalCase (UserProfile, BookDetails)
- **Functions**: camelCase (getUserProfile, updateBookProgress)
- **Database**: snake_case (user_profiles, book_sessions)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, MAX_BOOKS)

## Component Organization
- Group components by feature (books/, goals/, dashboard/)
- Keep reusable components in shared/ directory
- Each component should be in its own folder with related files

## Configuration Management
- Keep environment variables in .env files
- Document all required environment variables
- Use different configs for development/production