import { connectDB } from '$lib/helpers/db.js';


export async function GET() {
    const db = await connectDB();

    try {
        for (let categoryId = 1; categoryId <= 17; categoryId++) {
            const items = Array.from({ length: 10 }, (_, index) => ({
                name: {
                    en: `Sample Item ${categoryId}-${index + 1}`,
                    tr: `Örnek Ürün ${categoryId}-${index + 1}`
                },
                category_id: categoryId.toString(),
                desc: {
                    en: `Description in English for Item ${categoryId}-${index + 1}`,
                    tr: `Ürün ${categoryId}-${index + 1} için Türkçe açıklama`
                },
                price: (100 + Math.floor(Math.random() * 100)).toString(),
                created_at: new Date()
            }));

            await db.collection('items').insertMany(items);
            console.log(`Inserted 10 items for category ${categoryId}`);
        }
        return new Response(JSON.stringify({ message: 'Dummy data added successfully' }), { status: 201 });
    } catch (err) {
        console.error('Error inserting dummy data:', err);
        return new Response(JSON.stringify({ error: 'Failed to add dummy data' }), { status: 500 });
    }
}