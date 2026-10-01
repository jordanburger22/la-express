-- The games table our routes read and write.
-- Run this once against your database before starting the server.

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title TEXT,
    genre TEXT,
    developer TEXT,
    rating INTEGER,
    completed BOOLEAN
);

-- Optional: the same games from games.js, so GET /games has something to return.
-- No id here: SERIAL fills it in for us, the same way POST /games does.
INSERT INTO games (title, genre, developer, rating, completed) VALUES
    ('Baldur''s Gate 3', 'RPG', 'Larian Studios', 10, true),
    ('Kingdom Come: Deliverance 2', 'RPG', 'Warhorse Studios', 10, true),
    ('Overwatch 2', 'Shooter', 'Blizzard Entertainment', 8, false),
    ('PUBG', 'Battle Royale', 'Krafton', 9, false),
    ('The Witcher 3', 'RPG', 'CD Projekt Red', 9, true),
    ('Destiny 2', 'Shooter', 'Bungie', 8, false),
    ('Assassin''s Creed Black Flag', 'Action Adventure', 'Ubisoft', 9, true),
    ('Apex Legends', 'Battle Royale', 'Respawn Entertainment', 8, false);
