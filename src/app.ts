import express, {NextFunction} from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./repositories/courses-in-memory_repository";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use('/courses',getCoursesRouter(db))

app.use('/__test__',getTestsRouter(db))

app.get("/users", (req, res) => {
    //@ts-ignore
    const blabla =req.blabla
    res.send({value:blabla + 'Welcome to backend'});
})