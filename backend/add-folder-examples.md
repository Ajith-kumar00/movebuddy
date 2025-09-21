# Add Folder API Examples

## 1. Basic Folder Creation (Minimal Required Fields)

```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "My First Move",
  "title": "Moving to Downtown",
  "userId": "user-123"
}
```

## 2. Complete Folder Creation (All Fields)

```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "Moving to New York",
  "title": "New York Relocation Project 2024",
  "description": "Moving from California to New York for work opportunity",
  "publishingYear": 2024,
  "image": "https://example.com/nyc-move.jpg",
  "userId": "user-123",
  "status": "pending",
  "moveDate": "2024-02-15",
  "address": {
    "from": {
      "street": "123 Main Street",
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
  "metadata": {
    "movingCompany": "ABC Movers",
    "specialInstructions": "Handle fragile items carefully"
  }
}
```

## 3. Quick Move Folder

```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "Quick Move",
  "title": "Emergency Relocation",
  "publishingYear": 2024,
  "image": "https://example.com/emergency-move.jpg",
  "userId": "user-456",
  "status": "in_progress",
  "tags": ["urgent", "emergency"],
  "estimatedCost": 2000
}
```

## 4. Work Relocation Folder

```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "Work Relocation",
  "title": "Company Transfer to Seattle",
  "description": "Company is relocating our team to Seattle office",
  "publishingYear": 2024,
  "image": "https://example.com/seattle-office.jpg",
  "userId": "user-789",
  "status": "pending",
  "moveDate": "2024-03-01",
  "address": {
    "from": {
      "street": "789 Business Ave",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "USA"
    },
    "to": {
      "street": "321 Tech Street",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "USA"
    }
  },
  "tags": ["work", "company", "relocation"],
  "estimatedCost": 8000,
  "metadata": {
    "company": "TechCorp Inc",
    "relocationPackage": true
  }
}
```

## 5. Family Move with Multiple Items

```bash
POST http://localhost:3001/folders
Content-Type: application/json

{
  "name": "Family Move",
  "title": "Big Family Relocation to Texas",
  "description": "Moving entire family from New York to Texas for better cost of living",
  "publishingYear": 2024,
  "image": "https://example.com/family-move.jpg",
  "userId": "user-family-001",
  "status": "pending",
  "moveDate": "2024-04-15",
  "address": {
    "from": {
      "street": "100 Park Avenue",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "to": {
      "street": "500 Main Street",
      "city": "Austin",
      "state": "TX",
      "zipCode": "73301",
      "country": "USA"
    }
  },
  "tags": ["family", "long-distance", "cost-saving"],
  "estimatedCost": 15000,
  "metadata": {
    "familySize": 4,
    "pets": 2,
    "specialItems": ["piano", "antique furniture"]
  }
}
```

## Response Examples

### Successful Creation Response
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "Moving to New York",
  "title": "New York Relocation Project 2024",
  "description": "Moving from California to New York for work opportunity",
  "publishingYear": 2024,
  "image": "https://example.com/nyc-move.jpg",
  "userId": "user-123",
  "status": "pending",
  "moveDate": "2024-02-15T00:00:00.000Z",
  "address": {
    "from": {
      "street": "123 Main Street",
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
  "metadata": {
    "movingCompany": "ABC Movers",
    "specialInstructions": "Handle fragile items carefully"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (Missing Required Fields)
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "userId should not be empty"
  ],
  "error": "Bad Request"
}
```

## Using cURL Commands

### Basic cURL Example
```bash
curl -X POST http://localhost:3001/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Move",
    "title": "Test Relocation",
    "userId": "test-user-123"
  }'
```

### Complete cURL Example
```bash
curl -X POST http://localhost:3001/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Moving to New York",
    "title": "New York Relocation Project 2024",
    "description": "Moving from California to New York for work",
    "publishingYear": 2024,
    "image": "https://example.com/nyc-move.jpg",
    "userId": "user-123",
    "status": "pending",
    "tags": ["work", "urgent"],
    "estimatedCost": 5000
  }'
```

## Required vs Optional Fields

### Required Fields
- `name` (string): Folder name
- `title` (string): Folder title
- `userId` (string): User ID who owns this folder

### Optional Fields
- `description` (string): Folder description
- `publishingYear` (number): Publishing year (1900 to current year + 1)
- `image` (string): Image URL or path
- `status` (enum): 'pending', 'in_progress', 'completed', 'cancelled'
- `moveDate` (string): Move date in ISO format
- `address` (object): From and to addresses
- `tags` (array): Array of string tags
- `estimatedCost` (number): Estimated moving cost
- `actualCost` (number): Actual moving cost
- `metadata` (object): Additional metadata
