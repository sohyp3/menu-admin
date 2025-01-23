import { sql } from "$lib/helpers/sql";
// import { preventDefault } from "svelte/legacy";

export async function load({ params }) {
    try {

        let parent_id = params.id
        await sql`
            CREATE TABLE IF NOT EXISTS item(id SERIAL PRIMARY KEY, name JSON NOT NULL, description JSON, price VARCHAR(10), parent_id INT, image VARCHAR(255),    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE CASCADE      );
                `

        const category = await sql(`SELECT * FROM category WHERE id = ${parent_id}`)


        const items = await sql(`SELECT * FROM item WHERE parent_id = ${parent_id} ORDER BY id ASC`);

        return { items, category };
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}


export const actions = {
    create: async ({ request, params }) => {
        let parent_id = params.id
        const data = await request.formData();


        let names = {
            "en": data.get("name-en"),
            "tr": data.get("name-tr"),
        }

        let descs = {
            "en": data.get("desc-en"),
            "tr": data.get("desc-tr"),
        }
        let data_image = data.get("image").toString()
        await sql(`INSERT INTO item(name,description,price,image,parent_id) VALUES ('${JSON.stringify(names)}','${JSON.stringify(descs)}','${data.get("price")}','${data_image}',${parent_id});`)

    },
    delete: async ({ request, }) => {
        const data = await request.formData();
        item_id = data.get("id")
        await sql(`DELETE FROM item WHERE id = ${item_id}`);


    },

    update: async ({ request, }) => {
        const data = await request.formData();

        console.log(data);



        let names = {
            "en": data.get("name-en"),
            "tr": data.get("name-tr"),
        }

        let descs = {
            "en": data.get("desc-en"),
            "tr": data.get("desc-tr"),
        }



        await sql(`
        UPDATE item 
    SET 
        name = jsonb_set(jsonb_set(name::jsonb, '{en}', to_jsonb('${names.en}'::text)), '{tr}', to_jsonb('${names.tr}'::text)),
        description = jsonb_set(jsonb_set(description::jsonb, '{en}', to_jsonb('${descs.en}'::text)), '{tr}', to_jsonb('${descs.tr}'::text)),
        price = '${data.get("price")}',
        image = '${data.get("image")}'
    WHERE id = ${data.get("id")};
        
        `);



    },

};
