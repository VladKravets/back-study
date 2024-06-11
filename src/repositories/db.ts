import {MongoClient} from 'mongodb'
import {log} from "node:util";

export type CourseType = {
    id: number
    title: string
    studentsCount?: number
}
export type DBType = {
    courses: CourseType[]
}

const mongoUri = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority";

console.log('URI',process.env.MONGODB_URI)

export const client = new MongoClient(mongoUri);

const db = client.db('courses');
export const frontendCollection = db.collection<CourseType>("front-end");

export async function runDb() {
    try {
        await client.connect()

        await client.db('users').command({ping: 1})
        console.log('Connected to MongoDB');
    } catch {
        console.log('Could not connect to MongoDB');
        await client.close()
    }
}