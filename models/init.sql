DROP FUNCTION IF EXISTS my_schema.get_category;
DROP FUNCTION IF EXISTS my_schema.get_challenge;
DROP PROCEDURE IF EXISTS my_schema.add_solve;
DROP FUNCTION IF EXISTS my_schema.submit_flag;
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

CREATE FUNCTION my_schema.get_category(_category categories, _team INTEGER = -1)
    RETURNS TABLE(id INTEGER, name varchar(64), points INTEGER, description varchar(1024), flag varchar(64), solves INTEGER, team_solved BOOLEAN)
LANGUAGE SQL
AS $$
    SELECT id,name,points,description,flag,solves,
        EXISTS (SELECT FROM solves WHERE challenge_id = id AND team_id = _team) AS team_solved
    FROM challenges
    WHERE category = _category;
$$;

CREATE FUNCTION my_schema.get_challenge(_challenge INTEGER, _team INTEGER = -1)
    RETURNS TABLE(id INTEGER, name varchar(64), category categories, points INTEGER, description varchar(1024), flag varchar(64), solves INTEGER, team_solved BOOLEAN)
LANGUAGE SQL
AS $$
    SELECT id,name,category,points,description,flag,solves,
        EXISTS (SELECT FROM solves WHERE challenge_id = id AND team_id = _team) AS team_solved
    FROM challenges
    WHERE id = _challenge;
$$;

CREATE PROCEDURE my_schema.add_solve(challenge INTEGER, team INTEGER)
LANGUAGE SQL
AS $$
    INSERT INTO my_schema.solves (challenge_id, team_id, timestamp) VALUES (challenge, team, now());
    UPDATE my_schema.challenges SET solves = solves + 1 WHERE id = challenge;
    UPDATE my_schema.teams SET points = points +
        (SELECT points FROM my_schema.challenges WHERE id = challenge)
    WHERE id = team;
$$;

CREATE FUNCTION my_schema.submit_flag(_challenge INTEGER, _team INTEGER, _flag varchar(64)) RETURNS BOOLEAN
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF EXISTS(SELECT FROM my_schema.challenges WHERE id = _challenge AND flag = _flag) THEN
        IF NOT EXISTS(SELECT FROM my_schema.solves WHERE challenge_id = _challenge AND team_id = _team) THEN
            CALL my_schema.add_solve(_challenge, _team);
        END IF;
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END
$$;
