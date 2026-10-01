const express = require('express')
const gamesRouter = express.Router()
const prisma = require('../prisma')

// server -> db
//
// Same five routes as the SQL version. What changed is only the middle line of each one:
// instead of writing SQL and passing $1, $2, we call a method on prisma.game.

// localhost:3001/games/
gamesRouter.get('/', async (req, res, next) => {
    try {
        // was: SELECT * FROM games
        const games = await prisma.game.findMany()
        res.status(200).send(games)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

gamesRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        // was: SELECT * FROM games WHERE id = $1
        // Number(id) because the URL gives us a string and the column is an Int.
        const game = await prisma.game.findUnique({ where: { id: Number(id) } })

        // edge case
        if (!game) {
            res.status(404)
            return next(new Error(`Game with id ${id} was not found`))
        }

        res.status(200).send(game)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})


gamesRouter.post('/', async (req, res, next) => {
    try {
        const { title, genre, developer, rating, completed } = req.body
        // was: INSERT INTO games (...) VALUES ($1 … $5) RETURNING *
        // create returns the new row, so RETURNING * has no equivalent — you just get it back.
        const game = await prisma.game.create({
            data: { title, genre, developer, rating, completed }
        })
        res.status(201).send(game)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

gamesRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        // was: DELETE FROM games WHERE id = $1 RETURNING *
        // delete finds the row and removes it in one call, and hands back the game it deleted.
        await prisma.game.delete({ where: { id: Number(id) } })
        res.status(200).send('Deleted Successfully')
    } catch (error) {
        // P2025 is Prisma's "no row matched that where". That is our 404.
        if (error.code === 'P2025') {
            res.status(404)
            return next(new Error(`Game with id ${req.params.id} was not found`))
        }
        res.status(500)
        return next(error)
    }
})

gamesRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, genre, developer, rating, completed } = req.body
        // was: SELECT the game, merge the body on top, then UPDATE games SET … WHERE id = $6 RETURNING *
        // Prisma skips any field that is undefined, so only what was sent changes. No find, no merge.
        const game = await prisma.game.update({
            where: { id: Number(id) },
            data: { title, genre, developer, rating, completed }
        })
        res.status(200).send(game)
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404)
            return next(new Error(`Game with id ${req.params.id} was not found`))
        }
        res.status(500)
        return next(error)
    }
})

module.exports = gamesRouter


// No CREATE TABLE at the bottom any more. The table is described in prisma/schema.prisma,
// and this makes the database match it:
//
//     npx prisma db push
//
// Run it again every time you change the schema. Not `prisma migrate` — see the README.
