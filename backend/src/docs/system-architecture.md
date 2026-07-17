# System Architecture

## Introduction

The Pulse backend follows a layered architecture that separates responsibilities across different modules. Each layer is responsible for a specific part of the application, making the codebase easier to understand, maintain, test, and extend.

The architecture is designed around the principle of **Separation of Concerns**, where routing, request handling, business logic, validation, and database interaction are all isolated into their respective layers. This approach allows new features to be added with minimal impact on the existing codebase while keeping the application scalable as it grows.

---

# High-Level Architecture

Pulse follows a client-server architecture.

```text
                        +-----------------------+
                        |   React + shadcn/ui   |
                        +-----------+-----------+
                                    |
                           HTTP / WebSocket
                                    |
                        +-----------v-----------+
                        |     Express Server    |
                        +-----------+-----------+
                                    |
                     +--------------+--------------+
                     |                             |
             REST Controllers             WebSocket Gateway
                     |                             |
                     +--------------+--------------+
                                    |
                            Service Layer
                                    |
                    +---------------+----------------+
                    |                                |
               Prisma ORM                       Redis
                    |                      (Pub/Sub, Cache,
                    |                     Presence, Events)
                    |
              PostgreSQL
```

### Components

**Frontend**

- Provides the user interface.
- Sends HTTP requests to the backend.
- Establishes WebSocket connections for real-time communication.
- Uses WebRTC for peer-to-peer voice communication.

**Express Server**

- Receives client requests.
- Routes requests to the appropriate controller.
- Executes middleware before reaching the controller.

**Service Layer**

- Contains the application's business logic.
- Handles authorization and validation of business rules.
- Communicates with the database through Prisma.

**PostgreSQL**

- Stores persistent application data such as users, servers, channels, members, and messages.

**Redis (Planned)**

- Enables Pub/Sub communication between multiple backend instances.
- Stores temporary data such as online presence and typing indicators.
- Provides caching for frequently accessed data.

---

# Request Lifecycle

Every incoming request follows a well-defined lifecycle.

```text
Client
    │
    ▼
Express Route
    │
    ▼
Middleware Pipeline
    ├── Authentication (Protected Routes)
    ├── Validation
    └── Future Middleware (Logging, Rate Limiting)
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
    │
    ▼
Service
    │
    ▼
Controller
    │
    ▼
HTTP Response
```

## Request Flow

1. The client sends an HTTP request to the Express server.
2. Express matches the request to the appropriate route.
3. The request passes through the middleware pipeline.
4. Protected routes verify the user's JWT before continuing.
5. Request data is validated using predefined Zod schemas.
6. The controller receives the validated request.
7. The controller delegates all business logic to the service layer.
8. The service performs authorization checks and executes business rules.
9. The service communicates with PostgreSQL through Prisma ORM.
10. Prisma returns the requested data or throws an exception.
11. The service returns the result to the controller.
12. The controller formats the HTTP response and sends it back to the client.

---

# Project Structure

```text
src/
│
├── controllers/
├── routes/
├── services/
├── middleware/
├── schemas/
├── lib/
├── utils/
├── constants/
├── prisma/
└── types/
```

### controllers/

Responsible for handling HTTP requests and responses.

Responsibilities:

- Receive requests.
- Call services.
- Return HTTP responses.

Should **not** contain:

- Business logic.
- Database queries.

---

### routes/

Responsible for defining API endpoints.

Responsibilities:

- Register routes.
- Configure middleware.
- Map requests to controllers.

Should **not** contain:

- Business logic.
- Database operations.

---

### services/

The core of the application.

Responsibilities:

- Implement business rules.
- Perform authorization.
- Execute database operations.
- Manage transactions.
- Coordinate multiple operations.

---

### middleware/

Responsible for processing requests before they reach controllers.

Examples:

- Authentication
- Validation
- Error handling

Future additions:

- Logging
- Rate limiting
- Request tracing

---

### schemas/

Contains Zod validation schemas.

Responsibilities:

- Validate request bodies.
- Validate route parameters.
- Ensure only valid data enters the application.

---

### lib/

Contains wrappers around third-party libraries.

Examples:

- Prisma Client
- JWT utilities
- Redis client (future)

---

### utils/

Contains reusable helper functions that are not tied to business logic.

Examples:

- String helpers
- Formatting helpers
- Utility functions

---

### constants/

Stores application-wide constants.

Examples:

- Member role rankings
- Application constants
- Static configuration values

---

### prisma/

Contains the database schema and migration history.

Responsible for managing the application's data model.

---

# Layer Responsibilities

## Routes

Routes define the public API of the application.

Responsibilities:

- URL mapping.
- Middleware registration.
- Controller mapping.

---

## Controllers

Controllers act as the communication layer between HTTP requests and the business logic.

Responsibilities:

- Read request data.
- Call the appropriate service.
- Return HTTP responses.

Controllers remain intentionally thin and do not contain business logic.

---

## Services

Services contain the core business logic of the application.

Responsibilities:

- Business rules.
- Authorization.
- Database interaction.
- Transactions.
- Coordination between multiple modules.

Keeping business logic inside services improves maintainability and makes the application easier to test.

---

## Middleware

Middleware executes before controllers.

Responsibilities:

- Authentication.
- Validation.
- Error forwarding.

Future middleware:

- Logging.
- Rate limiting.
- Metrics collection.

---

## Database Layer

The application uses Prisma ORM to communicate with PostgreSQL.

Responsibilities:

- Execute database queries.
- Provide type-safe database access.
- Manage relationships between entities.

Controllers never communicate directly with the database. All database access occurs through the service layer.

---

# Authentication Architecture

Pulse uses JWT-based authentication.

Components:

- Access Token
- Refresh Token
- HTTP-only Cookies
- Authentication Middleware

Authentication verifies the identity of the user before allowing access to protected resources.

Protected routes validate the access token before the request reaches the controller.

---

# Authorization Architecture

Authentication answers:

> **Who is the user?**

Authorization answers:

> **What is the user allowed to do?**

Permissions are managed through server memberships.

```
OWNER
   │
ADMIN
   │
MODERATOR
   │
MEMBER
```

Each member's role determines the actions they are allowed to perform within a server.

Authorization is performed inside the service layer where business rules are enforced.

---

# Data Flow

The application follows a one-way flow of data.

```text
Client
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
    │
    ▼
Service
    │
    ▼
Controller
    │
    ▼
Client
```

This architecture ensures that controllers never directly communicate with the database and all business logic remains centralized inside services.

---

# Error Handling

Pulse follows a centralized error handling strategy.

## AppError

`AppError` extends JavaScript's built-in `Error` class by including an HTTP status code and a custom message. It is used to represent expected application errors such as authorization failures, validation errors, or missing resources.

---

## asyncHandler

`asyncHandler` wraps asynchronous Express route handlers and forwards any thrown exceptions to the next middleware using `next(error)`. This removes the need to write repetitive `try...catch` blocks inside every controller.

---

## Global Error Middleware

The global error middleware acts as the final error handler for the application.

Responsibilities:

- Catch unhandled errors.
- Return consistent JSON responses.
- Send appropriate HTTP status codes.
- Prevent internal errors from leaking implementation details.

---

# Validation

Pulse uses Zod for request validation.

Validation occurs before business logic is executed.

Responsibilities:

- Validate request bodies.
- Validate route parameters.
- Reject invalid requests early.
- Ensure services always receive valid input.

---

# Real-Time Architecture

Pulse will support real-time communication using WebSockets and WebRTC.

## WebSockets

Responsible for:

- Real-time messaging.
- Typing indicators.
- Presence updates.
- Live notifications.

---

## Redis

Redis will be introduced to support scalable real-time communication.

Responsibilities:

- Pub/Sub messaging.
- Online presence.
- Typing indicators.
- Caching.
- Horizontal scaling across multiple backend instances.

---

## WebRTC

WebRTC will provide peer-to-peer communication for voice channels.

Responsibilities:

- Voice communication.
- Audio streaming.
- Peer-to-peer media exchange.

WebSockets will be used as the signaling mechanism for establishing WebRTC connections.

---

# Design Principles

The architecture of Pulse follows several core software engineering principles.

- Separation of Concerns
- Layered Architecture
- Single Responsibility Principle
- Thin Controllers
- Business Logic in Services
- Type Safety with TypeScript
- RESTful API Design
- Modular Project Structure
- Scalable System Design
- Reusable Middleware
- Centralized Error Handling

---

# Future Improvements

The architecture is designed to evolve as the project grows.
