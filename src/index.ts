import { Request, Response, NextFunction } from "express";
import { compare, hash } from "bcrypt";

// User object type definition for storing credentials
// e.g. { 'username': 'password' }
// The password can be a raw string or a bcrypt hash
// depending on the useRawPasswords option
interface User {
  [username: string]: string;
}

interface AuthMiddlewareOptions {
  useRawPasswords?: boolean;
}

/**
 * Parses the SWAGGER_USERS environment variable into a User object.
 * @param envVar - The SWAGGER_USERS environment variable string
 * @returns Parsed User object or an empty object if parsing fails
 */
const parseUserCredentials = (envVar: string): User => {
  try {
    return JSON.parse(envVar);
  } catch (error) {
    console.error("Failed to parse SWAGGER_USERS environment variable:", error);
    return {};
  }
};

/**
 * Authenticates a user based on provided credentials.
 * @param username - The username to authenticate
 * @param password - The password to authenticate
 * @param users - The User object containing credentials
 * @param useRawPasswords - Whether to use raw passwords or bcrypt hashes
 * @returns A boolean indicating whether authentication was successful
 */
const authenticate = async (
  username: string,
  password: string,
  users: User,
  useRawPasswords: boolean
): Promise<boolean> => {
  const storedPassword = users[username];
  if (!storedPassword) return false;

  if (useRawPasswords) {
    return password === storedPassword;
  } else {
    return await compare(password, storedPassword);
  }
};

/**
 * Creates an Express middleware for Swagger UI authentication.
 * @param options - Configuration options for the middleware
 * @returns An Express middleware function
 */
const createAuthMiddleware = (options: AuthMiddlewareOptions = {}) => {
  const { useRawPasswords = false } = options;
  const users: User = parseUserCredentials(process.env.SWAGGER_USERS || "{}");

  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Swagger UI"');
      return res.status(401).send("Authentication required");
    }

    const [, credentials] = authHeader.split(" ");
    const [username, password] = Buffer.from(credentials, "base64")
      .toString()
      .split(":");

    if (await authenticate(username, password, users, useRawPasswords)) {
      next();
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="Swagger UI"');
      res.status(401).send("Invalid credentials");
    }
  };
};

export { generatePasswordHash, generateUserObject } from "./passwordUtils";
export default createAuthMiddleware;
