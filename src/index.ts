import express from 'express'

const app = express()
const port = process.env.PORT || 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

const db = {
    users: [
        {id: 1, username: 'Vlad'},
        {id: 2, username: 'Natasha'},
        {id: 3, username: 'Yuliana'},
        {id: 4, username: 'Misha'}
    ]
}

app.get('/', (req, res) => {

    res.send('Hi people')
})

// CRUD USERS
app.get('/users', (req, res) => {
    if (!db.users.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(db.users)
})

app.get('/users/:id', (req, res) => {
    const foundUser = db.users.find(el => el.id === +req.params.id);

    if (!foundUser) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundUser)
})

app.post('/users', (req, res) => {
    if (!req.body.username) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const newUser = {
        id: +(new Date()),
        username: req.body.username
    }
    db.users.push(newUser)
    console.log(newUser)
    res.status(HTTP_STATUSES.CREATED_201).json(newUser)

})

app.put('/users/:id', (req, res) => {

    if (!req.body.username) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const foundUser = db.users.find(el => el.id === +req.params.id);
    if (!foundUser) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    foundUser.username = req.body.username

    res.status(HTTP_STATUSES.CREATED_201).json(foundUser)

})

app.delete('/users/:id', (req, res) => {
    db.users = db.users.filter(el => el.id !== +req.params.id);

    if (!db.users) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    res.json(db.users)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})