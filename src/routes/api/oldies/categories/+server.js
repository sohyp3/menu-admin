import { connectDB } from '$lib/helpers/db.js';

export async function GET({ url }) {
    const db = await connectDB();

    const categories = await db
        .collection('categories')
        .find({ })
        .toArray();

    return new Response(JSON.stringify(categories));
}

