// prisma.config.js — where the connection string lives now.
//
// In older Prisma the database url sat inside schema.prisma. From Prisma 7 it lives here, and
// schema.prisma describes only the shape of your tables.
//
// The require below is doing real work. As soon as this file exists, the Prisma CLI stops reading
// .env on its own — it prints "Prisma config detected, skipping environment variable loading" and
// then reports DATABASE_URL as missing even though it is sitting in .env. Loading dotenv here is
// what puts it back.
require('dotenv/config');

module.exports = {
  schema: 'prisma/schema.prisma',
  datasource: { url: process.env.DATABASE_URL },
};
