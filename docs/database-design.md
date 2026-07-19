# Database Design

## 1. Overview

Pulse uses **PostgreSQL** as its primary relational database with
**Prisma ORM** for schema definition, migrations, and type-safe database
access.

The database is designed around the following principles:

-   Normalize data to reduce redundancy.
-   Maintain referential integrity using foreign keys.
-   Use transactions for operations that modify multiple tables.
-   Enforce authorization through relationships instead of duplicated
    data.
-   Keep the schema extensible for future features such as direct
    messages, voice channels, and permissions.

------------------------------------------------------------------------

# 2. Database Technology

  Component       Technology
  --------------- ----------------
  Database        PostgreSQL
  ORM             Prisma
  Migrations      Prisma Migrate
  Query Builder   Prisma Client

------------------------------------------------------------------------

# 3. Entity Relationship Overview

Current core entities:

-   User
-   Server
-   Member
-   Channel
-   Invite *(planned/current implementation)*
-   Message *(planned)*

Relationships:

    User
     ├── owns ─────────────► Server
     ├── belongs to ───────► Member ◄──── belongs to ───── Server
     └── creates ──────────► Invite

    Server
     ├── contains ─────────► Channel
     ├── contains ─────────► Member
     └── contains ─────────► Invite

    Channel
     └── contains ─────────► Message (future)

------------------------------------------------------------------------

# 4. Tables

## User

### Purpose

Stores authentication and profile information for every registered user.

### Relationships

-   One user can own many servers.
-   One user can belong to many servers through the Member table.
-   One user can create many invites.

------------------------------------------------------------------------

## Server

### Purpose

Represents a workspace/community.

### Relationships

-   One server has one owner.
-   One server contains many members.
-   One server contains many channels.
-   One server contains many invites.

------------------------------------------------------------------------

## Member

### Purpose

Represents a user's membership inside a specific server.

This table is the bridge between User and Server.

### Relationships

-   Many members belong to one user.
-   Many members belong to one server.

### Important Constraint

A user can only join the same server once.

Example:

    @@unique([userId, serverId])

------------------------------------------------------------------------

## Channel

### Purpose

Represents communication channels inside a server.

Examples:

-   general
-   announcements
-   gaming

### Relationships

-   One channel belongs to one server.
-   One channel will contain many messages.

------------------------------------------------------------------------

## Invite

### Purpose

Allows users to join a server using an invite code.

### Relationships

-   One invite belongs to one server.
-   One invite is created by one user.

Future improvements:

-   Expiration
-   Maximum uses
-   Usage tracking

------------------------------------------------------------------------

## Message (Future)

### Purpose

Stores text messages sent inside channels.

### Relationships

-   One message belongs to one channel.
-   One message belongs to one user.

------------------------------------------------------------------------

# 5. Design Decisions

## Member Table

Instead of storing a list of users inside the Server table, membership
is modeled using a separate Member table.

Benefits:

-   Supports many-to-many relationships.
-   Stores server-specific data such as roles.
-   Easily extensible with future permissions and nicknames.

------------------------------------------------------------------------

## Ownership

Server ownership is stored on the Server table.

Member roles are used for authorization inside a server.

Ownership transfer updates both the Server and Member tables inside a
single transaction.

------------------------------------------------------------------------

## Role Hierarchy

Current hierarchy:

    OWNER
    ADMIN
    MODERATOR
    MEMBER

Higher roles inherit the permissions of lower roles.

------------------------------------------------------------------------

# 6. Referential Integrity

Foreign keys are used to guarantee valid relationships between tables.

Cascade deletion should be enabled where appropriate so dependent
records are cleaned up automatically when a parent entity is removed.

Examples:

-   Deleting a server removes its channels, members, and invites.
-   Deleting a channel removes its messages.

------------------------------------------------------------------------

# 7. Indexes and Constraints

Recommended indexes:

-   User.email (Unique)
-   User.handle (Unique)
-   Invite.code (Unique)
-   Member(userId, serverId) (Composite Unique)

------------------------------------------------------------------------

# 8. Future Database Extensions

Planned additions include:

-   Messages
-   Direct Messages
-   Attachments
-   Reactions
-   Threads
-   Voice Channels
-   Permission Overrides
-   Notifications
-   Audit Logs

The schema has been designed to accommodate these features without major
structural changes.
