// db.js — write once, import it anywhere
const SIMDB_URL = process.env.SIMDB_URL;  // the base URL above
const SIMDB_KEY = process.env.SIMDB_KEY;  // server-side only

export async function query(sql, params = []) {
  const r = await fetch(`${SIMDB_URL}/v1/projects/la-game-db/sql`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${SIMDB_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });
  const { rows } = await r.json();
  return rows;
}