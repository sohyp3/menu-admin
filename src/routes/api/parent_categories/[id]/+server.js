import { connectDB } from '$lib/helpers/db.js';

export async function GET({ params }) {
    const db = await connectDB();
    const categoryId = params.id;

    const categories = await db.collection('categories').find({ parent_category_id: categoryId }).toArray();

    if (!categories) {
        return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(categories));
}


async function getNextSequence(db, sequenceName) {
    
    const latestItem = await db.collection(sequenceName).findOne({},  { sort: { _id: -1 } });
    const latest_item_id = latestItem._id
    console.log(latest_item_id);
    return latest_item_id ? parseInt(latest_item_id) + 1 : 69;


}

export async function POST({ request, params }) {
    const db = await connectDB();
    const categoryId = params.id; // Parent category ID, if applicable

    try {
        const data = await request.json();

        // Validate input (add additional checks as needed)
        // if (!data.name || !data.name.en || !data.name.tr) {
        //     return new Response(JSON.stringify({ error: 'Name (en, tr) is required' }), { status: 400 });
        // }

        if (data.image && !data.image.startsWith('http')) {
            return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400 });
        }

        // Generate auto-incremented _id
        const nextId = await getNextSequence(db, 'categories')

        console.log(data);
        console.log("here");
        const category = {
            _id: nextId.toString(),
            "name": {
                "en": data.en,
                "tr": data.tr,
            },
            parent_category_id: categoryId ? categoryId : null,
            image: data.image || null,
            created_at: new Date(),
        };

        const result = await db.collection('categories').insertOne(category);

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'Category not created' }), { status: 500 });
        }

        return new Response(JSON.stringify(category), { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function PUT({ request, params }) {
    const db = await connectDB();
    const categoryId = params.id;

    try {
        const data = await request.json();
        const result = await db.collection('categories').updateOne(
            { _id: categoryId },
            { $set: data},
        );

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'Category not updated' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating category:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function DELETE({ params }) {
    const db = await connectDB();
    const categoryId = params.id;

    try {
        const result = await db.collection('categories').deleteOne({ _id: categoryId });

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'Category not deleted' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
