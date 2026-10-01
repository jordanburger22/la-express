const express = require('express')
const gamesRouter = express.Router()
const { query } = require('../db')

// server -> db

// localhost:3000/games/
gamesRouter.get('/', async (req, res, next) => {
    try {
        const games = await query('SELECT * FROM games')
        res.status(200).send(games)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

gamesRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const games = await query('SELECT * FROM games  WHERE id = $1', [id])

        // edge case
        if (!games[0]) {
            res.status(404)
            return next(new Error(`Game with id ${id} was not found`))
        }

        res.status(200).send(games[0])
    } catch (error) {
        res.status(500)
        return next(error)
    }
})


gamesRouter.post('/', async (req, res, next) => {
    try {
        const { title, genre, developer, rating, completed } = req.body
        const games = await query(
            'INSERT INTO games (title, genre, developer, rating, completed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, genre, developer, rating, completed]
        )
        res.status(201).send(games[0])
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

gamesRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        // RETURNING * gives back the deleted row, if empty nothing was deleted
        const games = await query('DELETE FROM games WHERE id = $1 RETURNING *', [id])

        if (!games[0]) {
            res.status(404)
            return next(new Error(`Game with id ${id} was not found`))
        }

        res.status(200).send('Deleted Successfully')
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

gamesRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const found = await query('SELECT * FROM games WHERE id = $1', [id])

        if(!found[0]){
            res.status(404)
            return next(new Error(`Game with id ${id} was not found`))
        }

        const updatedGame = {
            ...found[0],
            ...req.body
        }

        const {title, genre, developer, rating, completed} = updatedGame
        const games = await query(
            'UPDATE games SET title = $1, genre = $2, developer = $3, rating = $4, completed = $5 WHERE id = $6 RETURNING *',
            [title, genre, developer, rating, completed, id]
        )
        res.status(200).send(games[0])
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

module.exports = gamesRouter



// CREATE TABLE games (
//     id SERIAL PRIMARY KEY,
//     title TEXT,
//     genre TEXT,
//     developer TEXT,
//     rating INTEGER,
//     completed BOOLEAN
// );