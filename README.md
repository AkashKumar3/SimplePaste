# SimplePaste — Assignment Submission

SimplePaste is a minimal text-paste sharing service built as part of a technical assignment.  
It allows users to create temporary text pastes with optional expiration and view limits, and access them via a unique URL.

The project is implemented using modern, production-ready tooling with a focus on correctness, simplicity, and deployability.

---

## Project Live Link
- https://simplepaste-production.up.railway.app

## Project Overview

**Core functionality:**
- Create a paste with text content
- Optional expiration time (TTL)
- Optional maximum view count
- Unique URL per paste
- Read-only paste access
- Health check endpoint for automated verification

**Technology stack:**
- Next.js (App Router)
- TypeScript
- MongoDB (Atlas)
- Mongoose
- Tailwind CSS

---

## Repository Structure

```bash
app/
├── api/
│ ├── pastes/route.ts
│ ├── healthz/route.ts
├── p/[id]/page.tsx
├── page.tsx
lib/
├── db.ts
├── time.ts
models/
├── Paste.ts # Paste schema

```


The repository contains **only source code** and no build artifacts.

---

## Running the Project Locally

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas connection string

### Installation

```bash
npm install

```

### Environment Variables
    - Create a 
```bash
.env.local file with:

```

```bash
MONGODB_URI=<your-mongodb-uri>
BASE_URL=http://localhost:3000
TEST_MODE=1
```
### Development
```bash
npm run dev
```

## Production Build
```bash
npm run build
npm start
```
### The application installs and starts using standard commands with no manual database migrations or shell access required.
 - Persistence Layer
 - The persistence layer is implemented using MongoDB with Mongoose as the ODM.
 - Key characteristics:
    - Uses MongoDB Atlas as the backing store
    - Connection is cached using a global singleton pattern
    - Safe for serverless and hot-reload environments
    - No global mutable state that would break across requests
- The database schema stores:
    - Paste content
    - Creation timestamp
    - Optional expiration timestamp
    - Optional maximum view count

### API Endpoints
 - Create Paste
    - POST /api/pastes

```bash
Request body:
{
  "content": "Example text",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

 - Response:

```bash
{
  "id": "<paste-id>",
  "url": "<base-url>/p/<paste-id>"
}
```

### Health Check
- GET /api/healthz
    - Response:
```bash
{ "ok": true }
```
 - This endpoint is used for automated verification and deployment health checks.

### TEST_MODE
 ## The application supports a TEST_MODE environment variable.
 - When TEST_MODE=1:
    - Health check always responds successfully
    - Behavior is deterministic for automated testing
    - No non-essential side effects are triggered

 - This flag is intended only for assignment evaluation and testing and should not be enabled in production       environments.

### Code Quality & Compliance Notes
- No hardcoded absolute URLs pointing to localhost are committed
- No secrets, keys, or credentials are included in the repository
- Server-side logic does not rely on unsafe global mutable state
- Application starts successfully using documented commands
- No manual database setup or migrations are required

### Author
 - Akash Kumar
