import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { sql } from '$lib/helpers/sql.js';
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";


export function generateSessionToken() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase32LowerCaseNoPadding(bytes);
}


export async function createSession(token, userId) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    
    // Convert JavaScript Date to ISO string for PostgreSQL compatibility
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

    await sql`
        INSERT INTO user_session (id, user_id, expires_at)
        VALUES (${sessionId}, ${userId}, ${expiresAt})
    `;

    return { id: sessionId, userId, expiresAt };
}

export async function validateSessionToken(token) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const result = await sql`
        SELECT user_session.id, user_session.user_id, user_session.expires_at, app_user.id
        FROM user_session
        INNER JOIN app_user ON app_user.id = user_session.user_id
        WHERE user_session.id = ${sessionId}
    `;

    if (result.length === 0) {
        return { session: null, user: null };
    }

    const row = result[0];
    const session = { id: row.id, userId: row.user_id, expiresAt: new Date(row.expires_at) };
    const user = { id: row.id };

    // If session is expired, remove it from the database
    if (Date.now() >= session.expiresAt.getTime()) {
        await sql`DELETE FROM user_session WHERE id = ${session.id}`;
        return { session: null, user: null };
    }

    // Extend session expiration if < 15 days left
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await sql`
            UPDATE user_session SET expires_at = ${session.expiresAt}
            WHERE id = ${session.id}
        `;
    }

    return { session, user };
}

export async function invalidateSession(sessionId) {
    await sql`DELETE FROM user_session WHERE id = ${sessionId}`;
}
