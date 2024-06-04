import {HTTP_STATUSES} from "../utils";

export type CourseType = {
    id: number
    title: string
    studentsCount?: number
}
export type DBType = {
    courses: CourseType[]
}

export const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 25},
        {id: 2, title: 'back-end', studentsCount: 300},
        {id: 3, title: 'QA', studentsCount: 2},
        {id: 4, title: 'devops', studentsCount: 11},
        {id: 5, title: 'Design', studentsCount: 22}
    ]
}

export const coursesRepository = {
    findCourses(title: string | null | undefined) {
        if (title) {
            return db.courses.filter(c => c.title.indexOf(title) > -1)
        } else {
            return db.courses
        }
    },
    createCourses(title: string) {
        const newCourse = {
            id: +(new Date()),
            title: title,

        };
        db.courses.push(newCourse)

        return newCourse
    },
    getCourseById(id: number) {
        return db.courses.find(course => course.id === id)
    },
    deleteCourseById(id: number) {
        return db.courses.filter(course => course.id !== id)

    },
    updateCourseById(id: number, title: string) {
        const foundCourse = db.courses.find(course => course.id === id)
        if (foundCourse) {
            foundCourse.title = title
            return foundCourse
        }
    }
}