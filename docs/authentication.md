# Authentication

## 1. Overview

Pulse uses **JWT-based authentication** with a dual-token strategy:

-   **Access Token** -- Short-lived token used to access protected
    resources.
-   **Refresh Token** -- Long-lived token used to obtain new access
    tokens without requiring the user to log in again.

Passwords are securely hashed before storage and are never persisted in
plain text.

------------------------------------------------------------------------

# 2. Authentication Flow

    User
      │
      ├── Sign Up
      │      │
      │      ▼
      │  Password Hashing
      │      │
      │      ▼
      │  User Stored
      │
      └── Login
             │
             ▼
     Verify Email & Password
             │
             ▼
    Generate Access Token
    Generate Refresh Token
             │
             ▼
    Access Token → Response
    Refresh Token → HTTP Only Cookie

------------------------------------------------------------------------

# 3. Access Token

### Purpose

The access token is sent with every authenticated request.

Example:

``` http
Authorization: Bearer <access_token>
```

### Characteristics

-   Short-lived
-   Contains the authenticated user's identifier
-   Verified by the authentication middleware
-   Used to authorize protected endpoints

------------------------------------------------------------------------

# 4. Refresh Token

### Purpose

Allows clients to obtain a new access token after the current one
expires without forcing the user to log in again.

### Storage

-   HTTP Only Cookie
-   Not accessible from client-side JavaScript
-   Sent automatically with refresh requests

------------------------------------------------------------------------

# 5. Authentication Endpoints

## Sign Up

Creates a new user account.

### Responsibilities

-   Validate request body
-   Ensure email and handle are unique
-   Hash password
-   Store user

------------------------------------------------------------------------

## Login

Authenticates an existing user.

### Responsibilities

-   Validate credentials
-   Compare hashed password
-   Generate access token
-   Generate refresh token
-   Return authenticated user

------------------------------------------------------------------------

## Refresh Token

Issues a new access token using a valid refresh token.

### Flow

    Client
       │
    Expired Access Token
       │
    POST /refresh
       │
    Validate Refresh Token
       │
    Generate New Access Token
       │
    Return New Token

------------------------------------------------------------------------

## Logout

Logs the user out by invalidating the refresh session on the client.

### Responsibilities

-   Clear refresh token cookie
-   End authenticated session

------------------------------------------------------------------------

## Current User

Returns the authenticated user's profile.

Protected by the authentication middleware.

------------------------------------------------------------------------

# 6. Authentication Middleware

The middleware protects private endpoints.

Responsibilities:

-   Read Authorization header
-   Extract Bearer token
-   Verify JWT
-   Attach authenticated user information to the request
-   Reject unauthorized requests

------------------------------------------------------------------------

# 7. Password Security

Passwords are:

-   Hashed before storage
-   Never returned in API responses
-   Compared using a secure hashing algorithm during login

------------------------------------------------------------------------

# 8. Error Handling

Authentication failures return appropriate HTTP status codes.

Examples:

-   Invalid credentials
-   Missing token
-   Expired token
-   Invalid refresh token
-   Unauthorized access

------------------------------------------------------------------------

# 9. Security Considerations

Current implementation includes:

-   Password hashing
-   JWT authentication
-   Short-lived access tokens
-   HTTP Only refresh cookies
-   Request validation
-   Protected routes
-   Centralized error handling

Future improvements:

-   Email verification
-   Password reset
-   Multi-factor authentication
-   Session management
-   Refresh token rotation
-   Rate limiting on authentication endpoints
