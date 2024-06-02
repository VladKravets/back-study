import express, {Request, Response} from 'express'
import {RequestsWithBody, RequestsWithParams, RequestsWithParamsAndBody, RequestsWithQuery} from "./types";
import {CourseCreateModel} from "./models/CourseCreateModel";
import {CoursesQueryModel} from "./models/GetCoursesQueryModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";


export const app = express()
const port = 3000

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    NOT_FOUND: 404
}

type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 25},
        {id: 2, title: 'back-end', studentsCount: 300},
        {id: 3, title: 'QA', studentsCount: 2},
        {id: 4, title: 'devops', studentsCount: 11},
        {id: 5, title: 'Design', studentsCount: 22}
    ]
}

const getViewModel=(dbCourse:CourseType):CourseViewModel=>{
    return{
        id:dbCourse.id,
        title:dbCourse.title
    }
}
//GET
app.get('/courses', (req: RequestsWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
    }

    res.json(foundCourses.map(getViewModel))

})
app.get('/courses/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.json(getViewModel(foundCourse))
})

//POST
app.post('/courses', (req: RequestsWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
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
app.delete('/courses/:id', (req: RequestsWithParams<URIParamsCourseModel>, res: Response) => {
    db.courses = db.courses.filter(course => course.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
//delete testing
app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
//PUT
app.put('/courses/:id', (req: RequestsWithParamsAndBody<URIParamsCourseModel, { title: string }>, res: Response) => {
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


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})