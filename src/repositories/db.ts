import {MongoClient} from 'mongodb'

export type CourseType = {
    id: number
    title: string
    studentsCount?: number
}
export type DBType = {
    courses: CourseType[]
}

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority";
// const mongoUri ='mongodb+srv://vkravets:PAiNJ2g9tE4YBrAb@myclasterforapp.stjqkwi.mongodb.net/courses?maxPoolSize=20&w=majority'

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