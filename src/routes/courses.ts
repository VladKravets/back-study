import express, {Response} from "express";
import {RequestsWithBody, RequestsWithParams, RequestsWithParamsAndBody, RequestsWithQuery} from "../types";
import {CoursesQueryModel} from "../models/GetCoursesQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseModel} from "../models/URIParamsCourseModel";
import {CourseCreateModel} from "../models/CourseCreateModel";
import {HTTP_STATUSES} from "../utils";
import {coursesRepository, CourseType, DBType} from "../repositories/courses-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

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

    router.get('/', (req: RequestsWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
        const foundCourses = coursesRepository.findCourses(req.query.title?.toString())

        res.json(foundCourses)

    })
    router.get('/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
        const foundCourse = coursesRepository.getCourseById(+req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }
        res.json(getViewModel(foundCourse))
    })

//POST
    router.post('/',
        titleValidation, inputValidationMiddleware,
        (req: RequestsWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
            const newCourse = coursesRepository.createCourses(req.body.title)
            res.status(HTTP_STATUSES.CREATED_201).json(getViewModel(newCourse))
        })

    //PUT
    router.put('/:id', titleValidation, inputValidationMiddleware, (req: RequestsWithParamsAndBody<URIParamsCourseModel, {
        title: string
    }>, res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return;
        }

        const course = coursesRepository.updateCourseById(+req.params.id, req.body.title)

        if (!course) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }


        res.status(HTTP_STATUSES.NO_CONTENT).json(course)


    })


//DELETE
    router.delete('/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response) => {
        coursesRepository.deleteCourseById(+req.params.id)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    })


    return router

}