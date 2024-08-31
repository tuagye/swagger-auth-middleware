import { hash } from 'bcrypt';

/**
 * Generates a bcrypt hash for a given password.
 * @param password - The password to hash
 * @param saltRounds - The number of salt rounds to use (default: 10)
 * @returns A Promise that resolves to the bcrypt hash
 */
export async function generatePasswordHash(password: string, saltRounds: number = 10): Promise<string> {
  return await hash(password, saltRounds);
}

/**
 * Generates a User object with hashed passwords.
 * @param users - An object with usernames as keys and raw passwords as values
 * @param saltRounds - The number of salt rounds to use (default: 10)
 * @returns A Promise that resolves to a User object with hashed passwords
 */
export async function generateUserObject(users: { [username: string]: string }, saltRounds: number = 10): Promise<{ [username: string]: string }> {
  const hashedUsers: { [username: string]: string } = {};
  for (const [username, password] of Object.entries(users)) {
    hashedUsers[username] = await generatePasswordHash(password, saltRounds);
  }
  return hashedUsers;
}