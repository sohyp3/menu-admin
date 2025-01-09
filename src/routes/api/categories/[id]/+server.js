import { connectDB } from '$lib/helpers/db.js';

export async function GET({ params }) {
    const db = await connectDB();
    const categoryId = params.id;

    const items = await db.collection('items').find({ category_id: categoryId }).toArray();

    if (!items) {
        return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(items));
}



export async function POST({ request, params }) {
    const db = await connectDB();
    const categoryId = params.id; // Parent category ID, if applicable

    try {
        const data = await request.json();


        if (data.image && !data.image.startsWith('http')) {
            return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400 });
        }


        const item = {
            "name": {
                "en": data.en,
                "tr": data.tr,
            },
            category_id: categoryId ? categoryId : null,
            image: data.image || null,
            desc:{
                "en": data.en_desc,
                "tr": data.tr_desc,
            },
            price: data.price,
            created_at: new Date(),
        };

        const result = await db.collection('items').insertOne(item);

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'item not created' }), { status: 500 });
        }

        return new Response(JSON.stringify(item), { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

