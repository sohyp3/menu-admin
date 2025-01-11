import { connectDB } from '$lib/helpers/db.js';
import { ObjectId } from 'mongodb';

export async function GET({ params }) {
    const db = await connectDB();
    const categoryId = params.id;

    const items = await db.collection('items').find({ category_id: categoryId }).toArray();

    if (!items) {
        return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(items));
}



// export async function POST({ request, params }) {
//     console.log("ss");
//     const db = await connectDB();
//     const categoryId= params.id; 

//     try {
//         const data = await request.json();
//         if (data.image && !data.image.startsWith('http')) {
//             return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400 });
//         }

//         console.log(data);

//         const category = {
//             "name": {
//                 "en": data.en,
//                 "tr": data.tr,
//             },
//             "desc":{
//                 "en": data.desc_en,
//                 "tr": data.desc_tr,
//             },
//             price: data.price,
//             parent_category_id: categoryId ? categoryId.toString() : null,
//             image: data.image || null,
//             created_at: new Date(),
//         };

//         const result = await db.collection('categories').insertOne(category);

//         if (!result.acknowledged) {
//             return new Response(JSON.stringify({ error: 'Category not created' }), { status: 500 });
//         }

//         return new Response(JSON.stringify(category), { status: 201 });
//     } catch (error) {
//         console.error('Error creating category:', error);
//         return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
//     }
// }


export async function PUT({ request, params }) {
    const db = await connectDB();
    const itemId = params.id;

    try {
        const data = await request.json();
        const result = await db.collection('items').updateOne(
            { _id: itemId },
            { $set: data},
        );

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'item not updated' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'item updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating item:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}


export async function DELETE({ params }) {
    const db = await connectDB();
    const itemId= params.id;

    try {
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(itemId) });

        if (!result.acknowledged) {
            return new Response(JSON.stringify({ error: 'Category not deleted' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}




export async function POST({ request, params }) {
    const db = await connectDB();
    const categoryId = params.id; 

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
                "en": data.desc_en,
                "tr": data.desc_tr,
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

