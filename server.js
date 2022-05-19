require('dotenv').config
const express = require('express')
const { restart } = require('nodemon')
const app = express()
const bcrypt = require('bcrypt')
const { hash } = require('bcrypt')
var jwt = require('jsonwebtoken'),
    jwtSecret = "SebiSebi";
app.use(express.json())

const users = []

app.use(express.json())

app.get('/users/all', (req, res) => {
    res.json(users)
})

app.post('/users/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            id: req.body.id,
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        }
        users.push(user)
        res.status(201).send()

    }
    catch {
        res.status(500).send()
    }
    // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    // restart.json({ accessToken: accessToken })
})
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.email = req.body.email)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            var token = jwt.sign(
                {
                    id: users.id,
                    email: users.email,
                    name: users.name

                }, jwtSecret, {
                expiresIn: "4h"
            });
            res.send({ accessToken: token })
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})
app.listen(3000)