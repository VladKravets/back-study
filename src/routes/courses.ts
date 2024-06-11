import express, {Response} from "express";
import {RequestsWithBody, RequestsWithParams, RequestsWithParamsAndBody, RequestsWithQuery} from "../types";
import {CoursesQueryModel} from "../models/GetCoursesQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseModel} from "../models/URIParamsCourseModel";
import {CourseCreateModel} from "../models/CourseCreateModel";
import {HTTP_STATUSES} from "../utils";
import {coursesService} from "../domain/course-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {CourseType, DBType} from "../repositories/db";

export const getViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

const titleValidation = body('title').trim().isLength({
    min: 1,
    max: 40
}).withMessage('Title length should be greater than 10')

export const getCoursesRouter = (db: DBType) => {
    const router = express.Router();


//GET

    router.get('/', async (req: RequestsWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
        const foundCourses = await coursesService.findCourses(req.query.title?.toString())

        res.json(foundCourses)

    })
    router.get('/:id', async (req: RequestsWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
        const foundCourse = await coursesService.getCourseById(+req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }
        res.json(getViewModel(foundCourse))
    })

//POST
    router.post('/',
        titleValidation, inputValidationMiddleware,
        async (req: RequestsWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
            const newCourse = await coursesService.createCourses(req.body.title)
            res.status(HTTP_STATUSES.CREATED_201).json(getViewModel(newCourse))
        })

    //PUT
    router.put('/:id', titleValidation, inputValidationMiddleware, async (req: RequestsWithParamsAndBody<URIParamsCourseModel, {
        title: string
    }>, res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return;
        }

        const course = await coursesService.updateCourseById(+req.params.id, req.body.title)

        if (!course) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }


        res.status(HTTP_STATUSES.NO_CONTENT).json(course)


    })


//DELETE
    router.delete('/:id', async (req: RequestsWithParams<URIParamsCourseModel>, res: Response) => {
        await coursesService.deleteCourseById(+req.params.id)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    })


    return router

}