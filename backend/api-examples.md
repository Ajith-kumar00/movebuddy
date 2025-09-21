# MoveBuddy API Examples

## New Fields Added
- `title` (required): Folder title
- `publishingYear` (optional): Publishing year
- `image` (optional): Image URL or path

## API Endpoints Examples

### 1. Create a Folder with New Fields
```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "Moving to New York",
  "title": "New York Relocation Project 2024",
  "description": "Moving from California to New York for work",
  "publishingYear": 2024,
  "image": "https://example.com/nyc-move.jpg",
  "userId": "user-123",
  "status": "pending",
  "tags": ["work", "urgent", "relocation"],
  "estimatedCost": 5000,
  "actualCost": 0
}
```

### 2. Search Folders by Title
```bash
GET http://localhost:3001/folders/search?q=New York
```

### 3. Get Folders by Publishing Year
```bash
GET http://localhost:3001/folders/year/2024
```

### 4. Update Folder with New Fields
```bash
PATCH http://localhost:3001/folders/{folderId}
Content-Type: application/json

{
  "title": "Updated Project Title",
  "publishingYear": 2025,
  "image": "https://example.com/new-image.jpg"
}
```

### 5. Get All Folders (with pagination)
```bash
GET http://localhost:3001/folders?page=1&limit=10&userId=user-123
```

### 6. Get Folder Statistics
```bash
GET http://localhost:3001/folders/stats?userId=user-123
```

## Response Examples

### Folder Object
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "Moving to New York",
  "title": "New York Relocation Project 2024",
  "description": "Moving from California to New York for work",
  "publishingYear": 2024,
  "image": "https://example.com/nyc-move.jpg",
  "userId": "user-123",
  "status": "pending",
  "moveDate": "2024-02-15T00:00:00.000Z",
  "address": {
    "from": {
      "street": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    },
    "to": {
      "street": "456 Broadway",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "tags": ["work", "urgent", "relocation"],
  "estimatedCost": 5000,
  "actualCost": 0,
  "metadata": {},
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Search Results
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Moving to New York",
    "title": "New York Relocation Project 2024",
    "publishingYear": 2024,
    "image": "https://example.com/nyc-move.jpg",
    "status": "pending"
  }
]
```

### Statistics Response
```json
{
  "total": 5,
  "pending": 2,
  "inProgress": 1,
  "completed": 2,
  "cancelled": 0,
  "totalEstimatedCost": 25000,
  "totalActualCost": 15000
}
```
