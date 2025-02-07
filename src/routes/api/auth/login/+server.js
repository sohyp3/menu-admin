import { json } from '@sveltejs/kit';
import { sql } from '$lib/helpers/sql.js';
import { generateSessionToken, createSession } from '$lib/session.js';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    const { username, password } = await request.json();

    // Find user by username
    const result = await sql`
        SELECT id, password FROM app_user WHERE username = ${username}
    `;

    if (result.length === 0) {
        return json({ error: 'User not found' }, { status: 404 });
    }

    const user = result[0];

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Create session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Set-Cookie': `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Content-Type': 'application/json'
        }
    });
}
