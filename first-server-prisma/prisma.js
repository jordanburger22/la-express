// prisma.js — one client, imported anywhere. This file replaces db.js.
//
// With raw SQL we wrote a query() helper that sent SQL over HTTPS. Prisma connects straight to the
// database and gives us an object per model: prisma.game.findMany(), prisma.game.create(), and so
// on. The SQL still happens — Prisma writes it.
const { PrismaClient } = require('@prisma/client');

// One instance for the whole app. Making a new PrismaClient per request opens a new pool each
// time and you run out of connections quickly.
const prisma = new PrismaClient();

module.exports = prisma;
