# Authorization

## 1. Overview

Authentication identifies **who** a user is.

Authorization determines **what** an authenticated user is allowed to
do.

Pulse uses **Role-Based Access Control (RBAC)** at the server level.
Every member belongs to a server with a specific role, and that role
determines the actions they are permitted to perform.

------------------------------------------------------------------------

# 2. Authorization Flow

    Incoming Request
            │
            ▼
    Authentication Middleware
            │
            ▼
    Authenticated User
            │
            ▼
    Load Member Record
            │
            ▼
    Role & Permission Checks
            │
            ▼
    Execute Service

------------------------------------------------------------------------

# 3. Role Hierarchy

Current server roles:

    OWNER
    ADMIN
    MODERATOR
    MEMBER

Higher roles inherit the capabilities of lower roles.

  Role        Description
  ----------- -------------------------------------------------
  OWNER       Full control over the server.
  ADMIN       Manages most server resources except ownership.
  MODERATOR   Limited management capabilities.
  MEMBER      Standard participant.

------------------------------------------------------------------------

# 4. Server Membership

Every protected server operation begins by verifying that the
authenticated user belongs to the requested server.

Responsibilities:

-   Confirm membership.
-   Load the member record.
-   Expose the member role for further authorization.

This logic is centralized in the `ensureServerAccess()` helper to avoid
duplication across services.

------------------------------------------------------------------------

# 5. Authorization Rules

## Server

Examples:

-   Create server → Authenticated user.
-   Update server → Owner/Admin.
-   Delete server → Owner only.
-   Transfer ownership → Owner only.

------------------------------------------------------------------------

## Channels

Examples:

-   View channels → Any member.
-   Create channel → Owner/Admin.
-   Update channel → Owner/Admin.
-   Delete channel → Owner/Admin.

------------------------------------------------------------------------

## Members

Examples:

-   View members → Any member.
-   Update member role → Authorized according to role hierarchy.
-   Remove member → Authorized according to role hierarchy.
-   Transfer ownership → Owner only.

------------------------------------------------------------------------

# 6. Role Updates

When updating another member's role:

The requester must:

-   Belong to the server.
-   Have a higher role than the target member.
-   Not assign a role equal to or higher than their own.
-   Not modify their own role.

These checks prevent privilege escalation.

------------------------------------------------------------------------

# 7. Ownership Transfer

Ownership transfer is treated as a dedicated server operation rather
than a normal role update.

Process:

1.  Verify requester is the current owner.
2.  Verify target member belongs to the server.
3.  Execute a database transaction:
    -   Update the server owner.
    -   Demote the previous owner.
    -   Promote the new owner.

This guarantees consistency if any step fails.

------------------------------------------------------------------------

# 8. Centralized Authorization

Authorization logic is kept inside the service layer instead of
controllers.

Benefits:

-   Reusable logic.
-   Consistent security checks.
-   Thin controllers.
-   Easier testing.

------------------------------------------------------------------------

# 9. Error Responses

Typical authorization failures include:

-   User is not a server member.
-   Insufficient permissions.
-   Attempt to modify a higher-ranked member.
-   Attempt to assign an unauthorized role.
-   Attempt to modify own role.

These return appropriate HTTP 403 responses.

------------------------------------------------------------------------

# 10. Future Improvements

The current implementation uses role-based authorization.

Future versions may introduce fine-grained permissions such as:

-   CREATE_INVITE
-   MANAGE_CHANNELS
-   MANAGE_MEMBERS
-   MANAGE_MESSAGES
-   MANAGE_ROLES
-   MANAGE_SERVER

This would allow server administrators to customize permissions for each
role without changing application code.
