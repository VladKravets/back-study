import {CourseType, frontendCollection} from "./db";




export const coursesRepository = {
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        const filter: any = {}
        if (title) {
            filter.title = {$regex: title}
        }

        return frontendCollection.find(filter).toArray()
    },
    async createCourses(newCourse: CourseType): Promise<CourseType> {
        await frontendCollection.insertOne(newCourse)
        return newCourse
    },
    async getCourseById(id: number): Promise<CourseType | null> {
        const course: CourseType | null = await frontendCollection.findOne({id})
        if (course) {
            return course
        } else {
            return null
        }

    },
    async deleteCourseById(id: number): Promise<boolean> {
        const result = await frontendCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updateCourseById(id: number, title: string): Promise<any> {
        const foundCourse = await frontendCollection.updateOne({id: id}, {$set: {title: title}})

        if (foundCourse) {
            return foundCourse.matchedCount === 1
        }
    }
}