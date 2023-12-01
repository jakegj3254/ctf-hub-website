DROP PROCEDURE IF EXISTS add_solve;
DROP TABLE IF EXISTS solves;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS teams;
DROP TYPE IF EXISTS categories;

CREATE TYPE categories AS ENUM ('crypto', 'rev', 'pwn', 'web', 'misc');

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name varchar(64) NOT NULL,
    category categories NOT NULL,
    points INTEGER NOT NULL,
    description varchar(1024) NOT NULL,
    flag varchar(64) NOT NULL,
    solves INTEGER DEFAULT 0
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL,
    points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE solves (
    challenge_id INTEGER,
    team_id INTEGER,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    PRIMARY KEY (team_id, challenge_id)
);

CREATE PROCEDURE add_solve(challenge INTEGER, team INTEGER)
LANGUAGE SQL
AS $$
    INSERT INTO solves (challenge_id, team_id, timestamp) VALUES (challenge, team, now());
    UPDATE challenges SET solves = solves + 1 WHERE id = challenge;
    UPDATE teams SET points = points +
        (SELECT points FROM challenges WHERE id = challenge)
    WHERE id = team;
$$;
