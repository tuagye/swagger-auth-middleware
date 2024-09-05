# @tuagye/swagger-auth-middleware

A flexible, secure authentication middleware for Swagger UI in Express applications.

## Features

- Easy to set up and use
- Supports multiple users
- Uses bcrypt for secure password hashing
- Option to use raw passwords for development environments
- Utility functions for password hashing
- TypeScript support

## Installation

```bash
npm install @tuagye/swagger-auth-middleware
```

```bash
yarn add @tuagye/swagger-auth-middleware
```

## Usage

1. Set up your environment variable:

```
SWAGGER_USERS={"admin":"$2b$10$X7oVmW5nqc4FN1v0fz4/pOKz5LYcRpJQgclVhuhQH9RZxOvMQ5hEe","developer":"$2b$10$6QKtDtlVcx1XhF8L5y1gJeR5X5.xdxCEBi0eXqCTf2NYBp2G6atwu"}
```

2. Import and use the middleware:

```typescript
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import createAuthMiddleware from "@tuagye/swagger-auth-middleware";

const app = express();

const authMiddleware = createAuthMiddleware();
app.use(
  "/api-docs",
  authMiddleware,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
```

3. (Optional) Use raw passwords for development:

```typescript
const authMiddleware = createAuthMiddleware({ useRawPasswords: true });
```

## Generating Password Hashes

You can use the provided utility functions to generate password hashes:

```typescript
import {
  generatePasswordHash,
  generateUserObject,
} from "@tuagye/swagger-auth-middleware";

// Generate a single password hash
async function hashSinglePassword() {
  const hash = await generatePasswordHash("your-password-here");
  console.log(hash);
}

// Generate a user object with hashed passwords
async function generateUsers() {
  const users = {
    admin: "admin-password",
    developer: "dev-password",
  };
  const hashedUsers = await generateUserObject(users);
  console.log(JSON.stringify(hashedUsers));
}

hashSinglePassword();
generateUsers();
```

## Security Note

Always use environment variables to store your SWAGGER_USERS configuration. Never commit sensitive information to your repository. Use the `useRawPasswords` option only in secure `development` environments.

## License

MIT
