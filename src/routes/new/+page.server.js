import { sql } from "$lib/helpers/sql";
// import { preventDefault } from "svelte/legacy";

export async function load() {
	try {
		// Check if the table exists

		await sql`
      CREATE TABLE IF NOT EXISTS parent_category(id SERIAL PRIMARY KEY, name JSON NOT NULL);
      `


		const categories = await sql`
        SELECT * FROM parent_category
      `;
		return { categories };
	} catch (error) {
		console.error('Database operation failed:', error);
		throw error;
	}
}


export const actions = {
	default: async ({ request }) => {
		// preventDefault()
		const data = await request.formData();

		console.log(data);

		let names = {
			"en": data.get("name-en"),
			"tr": data.get("name-tr"),
		}
		await sql(`INSERT INTO parent_category (name) VALUES ('${JSON.stringify(names)}');`)

		// const data = await request.formData();
		// db.createTodo(cookies.get('userid'), data.get('description'));
	},
};
