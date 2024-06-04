import express, {Express, Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";
import {DBType} from "../repositories/courses-repository";

export const getTestsRouter = (db: DBType) => {
    const router = express.Router();

    //delete testing
    router.delete('/data', (req: Request, res: Response) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    })

    return router
}

