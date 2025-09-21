# MoveBuddy Backend

A NestJS backend API for managing folders and moves with MongoDB integration.

## Features

- **Folder Management**: Full CRUD operations for folders
- **MongoDB Integration**: Using Mongoose for database operations
- **Validation**: Input validation using class-validator
- **Swagger Documentation**: Auto-generated API documentation
- **CORS Support**: Configured for frontend integration
- **Pagination**: Built-in pagination for list endpoints
- **Search**: Full-text search across folder names, descriptions, and tags
- **Statistics**: Folder statistics and analytics

## API Endpoints

### Folders
- `GET /folders` - Get all folders (with pagination and filtering)
- `GET /folders/:id` - Get a specific folder
- `POST /folders` - Create a new folder
- `PATCH /folders/:id` - Update a folder
- `DELETE /folders/:id` - Delete a folder
- `GET /folders/user/:userId` - Get folders by user ID
- `GET /folders/search?q=query` - Search folders by name, title, description, or tags
- `GET /folders/year/:year` - Get folders by publishing year
- `GET /folders/stats` - Get folder statistics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (make sure MongoDB is running on your system)

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/movebuddy)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## API Documentation

Once the server is running, visit `http://localhost:3001/api` for Swagger documentation.

## Folder Schema

```typescript
{
  name: string;           // Folder name
  title: string;          // Folder title (required)
  description?: string;   // Optional description
  publishingYear?: number; // Publishing year
  image?: string;         // Image URL or path
  userId: string;         // Owner user ID
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  moveDate?: Date;        // Planned move date
  address?: {             // From and to addresses
    from: Address;
    to: Address;
  };
  tags: string[];         // Categorization tags
  estimatedCost: number;  // Estimated moving cost
  actualCost: number;     // Actual moving cost
  metadata?: object;      // Additional metadata
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```
