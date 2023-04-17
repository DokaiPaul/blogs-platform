import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
dotenv.config()

const url = process.env.MONGO_URL || 'mongodb://localhost:27017'

if(!url){
    throw new Error('URL does not provided')
}
export const client = new MongoClient(url);

export async function runDB() {
    try {
        await client.connect();
        await client.db("products").command({ping: 1})
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Can't connect to db")
        await client.close();
    }
}