import {coursesRepository} from "../repositories/courses-in-db_repository";
import {CourseType} from "../repositories/db";

export const coursesService = {
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        return coursesRepository.findCourses(title)
    },
    async createCourses(title: string): Promise<CourseType> {
        const newCourse = {
            id: +(new Date()),
            title: title,
        };
        return coursesRepository.createCourses(newCourse)
    },
    async getCourseById(id: number): Promise<CourseType | null> {
        return await coursesRepository.getCourseById(id)


    },
    async deleteCourseById(id: number): Promise<boolean> {
        return await coursesRepository.deleteCourseById(id)
    },
    async updateCourseById(id: number, title: string): Promise<any> {
        return await coursesRepository.updateCourseById(id, title)
    }
}