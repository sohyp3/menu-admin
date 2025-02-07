export async function GET() {
    return new Response(null, {
        status: 302,
        headers: {
            'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0',
            location: '/auth'
        }
    });
}
