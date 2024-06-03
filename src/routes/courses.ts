import express, {Response} from "express";
import {RequestsWithBody, RequestsWithParams, RequestsWithParamsAndBody, RequestsWithQuery} from "../types";
import {CoursesQueryModel} from "../models/GetCoursesQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseModel} from "../models/URIParamsCourseModel";
import {CourseCreateModel} from "../models/CourseCreateModel";
import {CourseType, DBType} from "../db/db";
import {HTTP_STATUSES} from "../utils";





export const getViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const getCoursesRouter = (db: DBType) => {
    const router = express.Router();


//GET

    router.get('/', (req: RequestsWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
        }

        res.json(foundCourses.map(getViewModel))

    })
    router.get('/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(course => course.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }
        res.json(getViewModel(foundCourse))
    })

//POST
    router.post('/', (req: RequestsWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return
        }

        const newCourse = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(newCourse)

        console.log(newCourse)
        res.status(HTTP_STATUSES.CREATED_201).json(getViewModel(newCourse))
    })

//DELETE
    router.delete('/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response) => {
        db.courses = db.courses.filter(course => course.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    })


//PUT
    router.put('/:id', (req: RequestsWithParamsAndBody<URIParamsCourseModel, { title: string }>, res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return;
        }

        const foundCourse = db.courses.find(course => course.id === +req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }

        foundCourse.title = req.body.title

        res.status(HTTP_STATUSES.NO_CONTENT).json(foundCourse)
    })

    return router

}