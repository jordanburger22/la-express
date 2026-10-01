// prisma.js — one client, imported anywhere. This file replaces db.js.
//
// With raw SQL we wrote a query() helper that sent SQL over HTTPS. Prisma connects straight to the
// database and gives us an object per model: prisma.game.findMany(), prisma.game.create(), and so
// on. The SQL still happens — Prisma writes it.
//
// Worth noticing: underneath, Prisma uses the SAME pg driver the raw-SQL version of this project
// used. It is not a different way of reaching Postgres, it is a layer on top of the same one.
require('dotenv').config(); // FIRST — before anything that reads process.env

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is missing — check your .env file.');

// Your tables live in your own schema, not in `public`. The CLI reads `?schema=` out of the
// connection string, but the client does not, so it has to be handed over separately. Read it back
// out of the string here rather than typing the name twice — two copies is one to get wrong, and
// the failure is unhelpful: every query dies with "permission denied for schema public", which is
// a confusing way to be told Prisma was looking in the wrong place.
const schema = new URL(url).searchParams.get('schema') || undefined;

// max: 3 because your SIMdb project allows three connections at once.
//
// This has to be set HERE. `connection_limit=3` in the connection string is a setting for Prisma's
// old query engine, and this driver does not read it — leave the cap off and pg quietly defaults to
// ten, which is more than your database will accept.
const adapter = new PrismaPg({ connectionString: url, max: 3 }, { schema });

// One instance for the whole app. Making a new PrismaClient per request opens a new pool each time
// and you run out of connections quickly.
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
