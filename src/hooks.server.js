import { validateSessionToken } from '$lib/session.js';
import { parse } from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Get the session token from cookies
    const cookies = parse(event.request.headers.get('cookie') || '');
    const token = cookies.session || null;

    // Validate the session
    let session = null;
    if (token) {
        const result = await validateSessionToken(token);
        session = result.session;
        event.locals.user = result.user;
    } else {
        event.locals.user = null;
    }

    // Public pages (login and signup)
    const publicRoutes = ['/auth',  '/api/auth/login'];

    // If user is NOT logged in and trying to access a protected page, redirect to login
    if (!session && !publicRoutes.includes(event.url.pathname)) {
        return new Response(null, {
            status: 302,
            headers: { location: '/auth' }
        });
    }

    return resolve(event);
}


export function load({ locals }) {
    return { user: locals.user };
}
