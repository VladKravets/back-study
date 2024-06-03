export type CourseType = {
    id: number
    title: string
    studentsCount: number
}
export type DBType = {
    courses:CourseType[]
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