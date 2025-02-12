import { sql } from "$lib/helpers/sql";
// import { preventDefault } from "svelte/legacy";

export async function load({ params }) {
    try {

        let parent_id = params.id
        await sql`
            CREATE TABLE IF NOT EXISTS category(id SERIAL PRIMARY KEY, name JSON NOT NULL,parent_id INT,image VARCHAR(255),    FOREIGN KEY (parent_id) REFERENCES parent_category(id) ON DELETE CASCADE      );
                `

        const parent_category = await sql(`SELECT * FROM parent_category WHERE id = ${parent_id}`)


        const categories = await sql(`SELECT * FROM category WHERE parent_id = ${parent_id}`);

        return { categories, parent_category };
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}


export const actions = {
    new : async ({ request, params }) => {
        let parent_id = params.id
        const data = await request.formData();


        let names = {
            "en": data.get("name-en"),
            "tr": data.get("name-tr"),
        }
        let data_image = data.get("image").toString()
        await sql(`INSERT INTO category (name,image,parent_id) VALUES ('${JSON.stringify(names)}','${data_image}',${parent_id});`)

    },

    update: async ({ request, }) => {
        const data = await request.formData();

        console.log(data);



        let names = {
            "en": data.get("name-en"),
            "tr": data.get("name-tr"),
        }



        let activeStatus = data.get("active") === 'on'


        await sql(`
        UPDATE category
    SET 
        name = jsonb_set(jsonb_set(name::jsonb, '{en}', to_jsonb('${names.en}'::text)), '{tr}', to_jsonb('${names.tr}'::text)),
        active = ${activeStatus}

    WHERE id = ${data.get("id")};
        
        `);
    }
};
