import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
// import { env } from '$env/static/private';


dotenv.config();
// const client = new MongoClient(env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;

// Load environment variables from a .env file into process.env

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

const client = new MongoClient(MONGO_URI);

/**
 * @type {import('mongodb').Db}
 */
let db;

export async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('menu'); 
    }
    return db;
}
