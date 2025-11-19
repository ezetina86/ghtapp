# Docker Containerization Strategy

## Container Architecture Overview

### Development Environment
```
┌─────────────────────────────────────────────────┐
│                Docker Compose                    │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    │
│  │   Frontend      │    │    Backend      │    │
│  │   (React/Vite)  │    │ (Express/Node)  │    │
│  │   Port: 3000    │◄──►│   Port: 3001    │    │
│  └─────────────────┘    └─────────────────┘    │
│                                                     │
│  ┌─────────────────┐                             │
│  │    Database     │                             │
│  │   (SQLite)      │                             │
│  │   Volume: db    │                             │
│  └─────────────────┘                             │
└─────────────────────────────────────────────────┘
```

### Production Environment
```
┌─────────────────────────────────────────────────┐
│           Nginx Reverse Proxy                    │
│              Port: 80/443                        │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    │
│  │   Frontend      │    │    Backend      │    │
│  │   (Build)       │    │ (Production)    │    │
│  │   Port: 80      │◄──►│   Port: 3001    │    │
│  └─────────────────┘    └─────────────────┘    │
│                                                     │
│  ┌─────────────────┐                             │
│  │    Database     │                             │
│  │   (SQLite)      │                             │
│  │   Persistent    │                             │
│  └─────────────────┘                             │
└─────────────────────────────────────────────────┘
```

## Development Docker Configuration

### docker-compose.yml (Development)
```yaml
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
      - /app/dist
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
      - backend_db:/app/prisma
    environment:
      - DATABASE_URL=file:./dev.db
      - NODE_ENV=development
      - PORT=3001
      - JWT_SECRET=dev-jwt-secret-key
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

### Frontend Dockerfile (Development)
```dockerfile
# Frontend Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --include=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev", "--", "--host"]
```

### Backend Dockerfile (Development)
```dockerfile
# Backend Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Prisma CLI globally
RUN npm install -g prisma

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "dev"]
```

## Production Docker Configuration

### docker-compose.prod.yml (Production)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: habit-tracker-frontend-prod
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - habit-tracker-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: habit-tracker-backend-prod
    ports:
      - "3001:3001"
    volumes:
      - backend_db:/app/db
    environment:
      - DATABASE_URL=file:./prod.db
      - NODE_ENV=production
      - PORT=3001
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - habit-tracker-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  backend_db:
    driver: local

networks:
  habit-tracker-network:
    driver: bridge
```

### Frontend Dockerfile (Production)
```dockerfile
# Frontend Production Dockerfile - Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile (Production)
```dockerfile
# Backend Production Dockerfile - Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Install Prisma CLI globally
RUN npm install -g prisma

# Install all dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install Prisma CLI for migrations
RUN npm install -g prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application and Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/index.js"]
```

## Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:3001/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Environment Configuration

### .env.example
```env
# Backend Environment Variables
DATABASE_URL=file:./prod.db
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=3001

# Frontend Environment Variables
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=HabitFlux
```

### .env.local (Development)
```env
# Development-specific environment variables
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-jwt-secret-key
NODE_ENV=development
PORT=3001
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=HabitFlux
```

## Docker Commands & Usage

### Development Commands
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop development environment
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Database operations
docker-compose exec backend npx prisma db push
docker-compose exec backend npx prisma studio

# Run tests in containers
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

### Production Commands
```bash
# Deploy production environment
docker-compose -f docker-compose.prod.yml up -d

# Build production images
docker-compose -f docker-compose.prod.yml build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale services (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale backend=2

# Backup database
docker-compose exec backend cp /app/prod.db /app/backups/backup-$(date +%Y%m%d).db

# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Database Management

### Prisma Commands in Docker
```bash
# Generate Prisma client
docker-compose exec backend npx prisma generate

# Push schema changes
docker-compose exec backend npx prisma db push

# Create and apply migrations
docker-compose exec backend npx prisma migrate dev --name init

# Open Prisma Studio
docker-compose exec backend npx prisma studio

# Reset database
docker-compose exec backend npx prisma migrate reset
```

### Database Backup Strategy
```bash
# Create backup script
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/app/backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Copy database file
docker-compose exec backend cp /app/prod.db $BACKUP_DIR/backup-$DATE.db

# Compress backup
docker-compose exec backend gzip $BACKUP_DIR/backup-$DATE.db

echo "Backup created: backup-$DATE.db.gz"
```

## Security Considerations

### Container Security
- Use non-root users in containers
- Scan images for vulnerabilities (`docker scan`)
- Use specific version tags, not `latest`
- Implement health checks
- Use secrets management for sensitive data

### Network Security
- Use internal Docker networks
- Limit exposed ports
- Implement proper CORS policies
- Use HTTPS in production

### Data Security
- Encrypt sensitive environment variables
- Regular database backups
- Implement proper access controls
- Monitor container resource usage

## Performance Optimization

### Image Optimization
- Use multi-stage builds
- Minimize layer size
- Use `.dockerignore` files
- Optimize dependency installation

### Container Optimization
- Set appropriate resource limits
- Use efficient base images (Alpine Linux)
- Optimize build context
- Cache dependencies properly

### .dockerignore Examples
```gitignore
# Frontend .dockerignore
node_modules
dist
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
```

```gitignore
# Backend .dockerignore
node_modules
dist
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
prisma/migrations
```

## Monitoring & Health Checks

### Health Check Implementation
```typescript
// Backend health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Docker Health Checks
```yaml
# Add to docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging Strategy
- Use structured logging (JSON format)
- Log to stdout/stderr for Docker
- Implement log rotation
- Monitor container logs for errors

## Deployment Strategies

### Local Development
- Use docker-compose for development
- Hot reload for rapid development
- Volume mounting for live code changes
- Development-specific configurations

### Production Deployment
- Use production Docker Compose
- Implement proper health checks
- Use environment-specific configurations
- Implement backup and recovery procedures
- Monitor container health and performance

### Continuous Integration
- Build Docker images in CI/CD pipeline
- Run tests in containers
- Push images to container registry
- Deploy with orchestrated deployment tools