DELETE FROM my_schema.solves;
DELETE FROM my_schema.challenges;
DELETE FROM my_schema.teams;

INSERT INTO my_schema.teams (name) VALUES('Team A');
INSERT INTO my_schema.teams (name) VALUES('Team B');
INSERT INTO my_schema.teams (name) VALUES('Team C');

INSERT INTO my_schema.challenges (name, category, points, description, flag)
    VALUES('Challenge A', 'web', 100, 'About challenge a...', 'test{a}');
INSERT INTO my_schema.challenges (name, category, points, description, flag)
    VALUES('Challenge B', 'rev', 200, 'About challenge b...', 'test{b}');
INSERT INTO my_schema.challenges (name, category, points, description, flag)
    VALUES('Challenge C', 'rev', 300, 'About challenge c...', 'test{c}');
INSERT INTO my_schema.challenges (name, category, points, description, flag)
    VALUES('Challenge D', 'web', 100, 'About challenge d...', 'test{d}');

SELECT FROM my_schema.submit_flag(
    (SELECT id from my_schema.challenges WHERE name = 'Challenge A'),
    (SELECT id from my_schema.teams WHERE name = 'Team A'),
    (SELECT flag from my_schema.challenges WHERE name = 'Challenge A')
);
SELECT FROM my_schema.submit_flag(
    (SELECT id from my_schema.challenges WHERE name = 'Challenge C'),
    (SELECT id from my_schema.teams WHERE name = 'Team A'),
    (SELECT flag from my_schema.challenges WHERE name = 'Challenge C')
);
SELECT FROM my_schema.submit_flag(
    (SELECT id from my_schema.challenges WHERE name = 'Challenge B'),
    (SELECT id from my_schema.teams WHERE name = 'Team B'),
    (SELECT flag from my_schema.challenges WHERE name = 'Challenge B')
);
SELECT FROM my_schema.submit_flag(
    (SELECT id from my_schema.challenges WHERE name = 'Challenge C'),
    (SELECT id from my_schema.teams WHERE name = 'Team B'),
    (SELECT flag from my_schema.challenges WHERE name = 'Challenge C')
);
