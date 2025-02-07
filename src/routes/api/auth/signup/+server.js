import { json } from '@sveltejs/kit';
import { sql } from '$lib/helpers/sql.js';
import { generateSessionToken, createSession } from '$lib/session.js';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    // console.log(request);
    const { username, password } = await request.json();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    try {
        const result = await sql`
        INSERT INTO app_user (username, password)
        VALUES (${username}, ${hashedPassword})
        RETURNING id
    `;
        const userId = result[0].id;
        const token = generateSessionToken();
        const session = await createSession(token, userId);

        return json({ token, session });
    } catch (error) {
        console.log(error);
        return json({ error: 'Username already exists' }, { status: 400 });
    }
}
