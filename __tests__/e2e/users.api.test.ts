import request from 'supertest'
import {app, HTTP_STATUSES} from '../../src'

describe('course', () => {
    beforeAll(async () => {
        const response = await request(app).post('/courses').send({title: 'Test Course'});
        createdCourse = response.body;
        await request(app).delete('/__test__/data')
    })
    let createdCourse: any = null

    it('should return 200 and empty array ', async () => {
            await request(app).get('/courses')
                .expect(HTTP_STATUSES.OK_200, [])
        }
    )
    it('should return 404 for not existing course ', async () => {
        await request(app).get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND);
    })

    it('shouldn\'t create course with incorrect input data', async () => {
        await request(app).post('/courses').send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST)

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    });

    it('should create course with correct input data', async () => {
        const createdResponse = await request(app).post('/courses').send({title: 'Test completed'})
            .expect(HTTP_STATUSES.CREATED_201)

        const createdCourse = createdResponse.body

        expect(createdCourse).toEqual({
                id: expect.any(Number),
                title: 'Test completed'
            }
        )

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse])

    });


    it('shouldn\t update course not exist', async () => {
        await request(app).put(`/courses/` + -100).send({title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND)


    });

    it('shouldn\'t update course with incorrect input data', async () => {
        // create a course and assign it to the createdCourse variable
        const response = await request(app).post('/courses').send({title: 'Test Course'});
        const createdCourse = response.body;

        // make sure createdCourse is not null before accessing its properties
        if (!createdCourse) {
            throw new Error('createdCourse is null');
        }

        await request(app).put(`/courses/${createdCourse.id}`).send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST);

        await request(app).get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse);
    });

    it('should update course with correct input models', async () => {
        // create a course and assign it to the createdCourse variable
        const response = await request(app).post('/courses').send({title: 'Test Course'});
        const createdCourse = response.body;

        // make sure createdCourse is not null before accessing its properties
        if (!createdCourse) {
            throw new Error('createdCourse is null');
        }

        await request(app).put(`/courses/${createdCourse.id}`).send({title: 'changed title'})
            .expect(HTTP_STATUSES.NO_CONTENT);

        await request(app).get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse, title: 'changed title'});
    });

    it('should delete course', async () => {
        await request(app).delete(`/courses/` + createdCourse.id)

            .expect(HTTP_STATUSES.NO_CONTENT)

        await request(app).get(`/courses` + createdCourse.id)
            .expect(HTTP_STATUSES.NOT_FOUND)

    });


})