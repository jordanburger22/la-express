# first-server, with Prisma

The same server we built together — `/health`, and `/games` with all five CRUD routes — talking to
the database through **Prisma** instead of writing SQL by hand.

Everything outside the database layer is unchanged: same Express, same router, same error-handler
middleware, same 404s. Compare `routes/gamesRouter.js` with the SQL version and only the middle
line of each route is different.

## Running it

1. `npm install`
2. Get a database: **SIMdb → New database → SQL · Postgres → Connect → Show**.
   Paste the string into `.env` after `DATABASE_URL=`.
3. `npx prisma db push` — makes the database match `prisma/schema.prisma`.
4. `npm run dev`

Then the same requests as before:

```bash
curl localhost:3001/health
curl localhost:3001/games
curl -X POST localhost:3001/games -H 'content-type: application/json' \
  -d '{"title":"Hollow Knight","genre":"metroidvania","developer":"Team Cherry","rating":10,"completed":true}'
curl localhost:3001/games/1
curl -X PUT localhost:3001/games/1 -H 'content-type: application/json' -d '{"completed":false}'
curl -X DELETE localhost:3001/games/1
```

## What changed, line by line

| SQL version | Prisma version |
|---|---|
| `SELECT * FROM games` | `prisma.game.findMany()` |
| `SELECT * FROM games WHERE id = $1` | `prisma.game.findUnique({ where: { id } })` |
| `INSERT INTO games (…) VALUES ($1…$5) RETURNING *` | `prisma.game.create({ data })` |
| `SELECT` the game, merge `req.body` on top, then `UPDATE games SET … WHERE id = $6 RETURNING *` | `prisma.game.update({ where, data })` — one call, only the fields you send change |
| `DELETE FROM games WHERE id = $1 RETURNING *` | `prisma.game.delete({ where })` |
| `CREATE TABLE games (…)` at the bottom of the router | `prisma/schema.prisma` + `npx prisma db push` |
| `db.js` with a `query()` helper over HTTPS | `prisma.js` with one client |

The SQL has not gone anywhere — Prisma writes it. If you want to see it, add
`new PrismaClient({ log: ['query'] })` in `prisma.js` and watch the terminal.

## Four things that will catch you

**"Not found" is an error, not `null`.** `findUnique` gives back `null` when nothing matches, so
`GET /:id` checks `if (!game)` like before. `update` and `delete` throw instead, with
`error.code === 'P2025'`, so PUT and DELETE check for that in their `catch` and send the 404 there.

**`require('dotenv').config()` must be the first line.** `require` runs immediately, so anything
imported above it reads `process.env` before `.env` has been loaded, and `DATABASE_URL` comes out
`undefined`. The error talks about the URL format and sends you looking at your connection string,
which is fine.

**`Number(id)`.** A URL parameter is always a string. The `id` column is an `Int`, and Prisma will
not quietly convert it the way a raw SQL driver did.

**Use `prisma db push`, not `prisma migrate`.** `migrate` builds a second throwaway database to
check itself against, and your SIMdb account cannot create databases — that is deliberate, and it
is what keeps every student database inside its size and retention rules. If you run `migrate` you
get error **P3014** talking about a "shadow database". Nothing is broken. Use `db push`.

## Where to look things up

**SIMdb → Prisma Reference** — searchable, every method on this page and more.
