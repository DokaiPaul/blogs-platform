import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
dotenv.config()

// const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const url = process.env.MONGO_URL

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