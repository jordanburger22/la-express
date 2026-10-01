// front end -> server (express) -> db
require('dotenv').config()          // FIRST — before anything that reads process.env
const express = require('express')
const gamesRouter = require('./routes/gamesRouter')

// create server
const app = express()

app.use(express.json())
// routes - endpoint + crud
// Create - post
// Read - get
// Update - put
// Delete - delete

app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy')
})
// http://localhost:3001/health


app.use('/games', gamesRouter)

// error handler middleware -  must have all 4 params
app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})

app.listen(3001, () => {
    console.log('Server running on port 3001')
})
