# Code Quality Standards

## Function Documentation
- All functions must have JSDoc/docstring comments
- Include parameter types and return types
- Document purpose, parameters, return values, and side effects
- Example:
```javascript
/**
 * Calculate reading streak based on daily entries
 * @param {Array} readingSessions - Array of reading session objects
 * @param {string} startDate - Start date for calculation (ISO string)
 * @returns {Object} - Object with currentStreak, longestStreak, and totalDays
 */
function calculateReadingStreak(readingSessions, startDate) {
  // Implementation
}
```

## Code Length Guidelines
- **Maximum function length**: 50 lines
- **Maximum file length**: 500 lines
- **Maximum component length**: 300 lines (React/Vue components)
- Break down complex functions into smaller, testable units

## Testing Requirements
- Write tests for all business logic functions
- Minimum 80% code coverage for critical paths
- Test all API endpoints with integration tests
- Mock external APIs and services in tests
- Include unit tests for utility functions

## Type Safety
- Use TypeScript for type hints where supported
- For JavaScript, use JSDoc type annotations
- Validate all user inputs with appropriate validation libraries
- Use PropTypes or similar for React component props

## Code Style
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Avoid magic numbers - define as constants
- Use early returns to reduce nesting

## Security Practices
- Validate all user inputs on both client and server
- Sanitize data before database operations
- Never commit sensitive credentials (API keys, passwords)
- Use environment variables for configuration
- Implement rate limiting on API endpoints

## Error Handling
- Implement comprehensive error handling
- Use try-catch blocks for async operations
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Implement fallback UI states for error conditions