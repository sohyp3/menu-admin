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

        return { categories , parent_category};
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}


export const actions = {
    default: async ({ request,params }) => {
        let parent_id = params.id
        const data = await request.formData();


        let names = {
            "en": data.get("name-en"),
            "tr": data.get("name-tr"),
        }
        let data_image = data.get("image").toString()
        await sql(`INSERT INTO category (name,image,parent_id) VALUES ('${JSON.stringify(names)}','${data_image}',${parent_id});`)

    },
};
