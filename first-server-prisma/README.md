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
4. `npx prisma generate` — writes the client your code imports.
5. `npm run dev`

Step 4 is easy to skip and the error does not point at it: you get
`Cannot find module '.prisma/client/default'`. Run it again after every change to
`prisma/schema.prisma`.

### If your network blocks downloads

Prisma fetches a helper program the first time you run `db push` or `generate`, from a host that
some school and training-centre networks block. You will see a **403** on a file ending in
`.sha256`, which looks like a corrupt download and is not one. We keep a copy, so set this once:

```bash
# macOS / Linux
export PRISMA_ENGINES_MIRROR=https://simplycodingcourses.com/prisma-engines
```
```powershell
# Windows PowerShell
$env:PRISMA_ENGINES_MIRROR="https://simplycodingcourses.com/prisma-engines"
```

No trailing slash. Nothing else changes. Once it has downloaded, it is cached and you do not need
the mirror again on that machine.

### Why the versions are pinned

`package.json` pins Prisma to an exact version rather than `^7.10.0`, and that is deliberate.
Right now `npm install prisma` on its own installs a **v8 release candidate**, while
`npm install @prisma/client` installs v7 — a mismatched pair, where the first command you type
fails because v8 renamed `db push` to `db update`. `npm install` in this folder gets the versions
this project was written for.

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
| `new Pool({ connectionString, max: 3 })` | the same `Pool`, handed to Prisma as an *adapter* |

That last row is worth a second look. Prisma does not have its own way of reaching Postgres — it
uses the **same `pg` driver** you used to write SQL by hand, and sits on top of it. That is why
both versions of this project configure the connection the same way, and why `max: 3` appears in
both.

The SQL has not gone anywhere — Prisma writes it. If you want to see it, add
`new PrismaClient({ log: ['query'] })` in `prisma.js` and watch the terminal.

## Six things that will catch you

**"permission denied for schema public".** Your tables live in your own schema, not in `public`,
and you have no rights to `public` at all — that is what keeps your database yours. `prisma db push`
reads the schema name out of `?schema=` in your connection string, but **the client does not**, so
`prisma.js` passes it separately. If you ever build a `PrismaClient` somewhere else, it needs the
same treatment, or every query fails with that message while the right schema sits in plain sight
in your `.env`.

**`max: 3` has to be in the code.** Your project allows three connections at once. The
`connection_limit=3` in your connection string was a setting for an older part of Prisma and is
**ignored** now — with it left off, the driver quietly tries to open ten and most of your queries
die with `too many connections for role`. It is set in `prisma.js`; leave it there.

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
