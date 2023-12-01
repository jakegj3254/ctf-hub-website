INSERT INTO teams (name) VALUES('Team A');
INSERT INTO teams (name) VALUES('Team B');
INSERT INTO teams (name) VALUES('Team C');

INSERT INTO challenges (name, category, points, description, flag)
    VALUES('Challenge A', 'web', 100, 'About challenge a...', 'test{a}');
INSERT INTO challenges (name, category, points, description, flag)
    VALUES('Challenge B', 'rev', 200, 'About challenge b...', 'test{b}');
INSERT INTO challenges (name, category, points, description, flag)
    VALUES('Challenge C', 'rev', 300, 'About challenge c...', 'test{c}');
INSERT INTO challenges (name, category, points, description, flag)
    VALUES('Challenge D', 'web', 100, 'About challenge d...', 'test{d}');

CALL add_solve(1, 1);
CALL add_solve(3, 1);
CALL add_solve(2, 2);
CALL add_solve(3, 2);
