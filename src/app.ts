import express from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use('/courses',getCoursesRouter(db))

app.use('/__test__',getTestsRouter(db))
