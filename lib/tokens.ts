import { randomUUID } from 'crypto';

/**
 * Generates a URL-safe management token by combining two UUIDs and
 * base64url-encoding the result.
 */
export function generateManagementToken(): string {
  const raw = `${randomUUID()}-${randomUUID()}`;
  return Buffer.from(raw).toString('base64url');
}

/**
 * "Verifies" a management token — in practice this is a DB lookup,
 * so we simply return the token as-is for the route to use.
 */
export function verifyManagementToken(token: string): string {
  return token;
}
