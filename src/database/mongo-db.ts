import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const dbName = 'bloggers-platform'
const url = process.env.MONGO_URL || `mongodb://localhost:27017/${dbName}`

if(!url){
    throw new Error('URL does not provided')
}

export async function runDB() {
    try {
        await mongoose.connect(url)
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Can't connect to db")
        await mongoose.disconnect()
    }
}