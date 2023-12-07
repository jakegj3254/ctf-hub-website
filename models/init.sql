DROP PROCEDURE IF EXISTS my_schema.add_solve;
DROP TABLE IF EXISTS my_schema.solves;
DROP TABLE IF EXISTS my_schema.challenges;
DROP TABLE IF EXISTS my_schema.teams;
DROP TYPE IF EXISTS my_schema.categories;
DROP SCHEMA IF EXISTS my_schema;

CREATE SCHEMA my_schema;

CREATE TYPE my_schema.categories AS ENUM ('crypto', 'rev', 'pwn', 'web', 'misc');

CREATE TABLE my_schema.challenges (
    id SERIAL PRIMARY KEY,
    name varchar(64) NOT NULL,
    category my_schema.categories NOT NULL,
    points INTEGER NOT NULL,
    description varchar(1024) NOT NULL,
    flag varchar(64) NOT NULL,
    solves INTEGER DEFAULT 0
);

CREATE TABLE my_schema.teams (
    id SERIAL PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL,
    points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE my_schema.solves (
    challenge_id INTEGER,
    team_id INTEGER,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (challenge_id) REFERENCES my_schema.challenges(id),
    FOREIGN KEY (team_id) REFERENCES my_schema.teams(id),
    PRIMARY KEY (team_id, challenge_id)
);

CREATE PROCEDURE my_schema.add_solve(challenge INTEGER, team INTEGER)
LANGUAGE SQL
AS $$
    INSERT INTO my_schema.solves (challenge_id, team_id, timestamp) VALUES (challenge, team, now());
    UPDATE my_schema.challenges SET solves = solves + 1 WHERE id = challenge;
    UPDATE my_schema.teams SET points = points +
        (SELECT points FROM my_schema.challenges WHERE id = challenge)
    WHERE id = team;
$$;
