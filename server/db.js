/*
 * Contains methods to perform basic create/read operations. In the future
 * they will interact with a proper database.
 */

let challenges = [];
let teams = [];
let solves = [];

/*
 * Create a new challenge and return the challenge's id
 *
 * Chal object must contain: name, points, description, category, and flag
 */
function create_challenge(chal) {
    challenges.push({
        name: chal.name,
        points: chal.points,
        description: chal.description,
        category: chal.category,
        flag: chal.flag,
        solves: 0,
    });
    return challenges.length;
}

/*
 * Get all challenges
 */
function get_challenges() {
    return challenges;
}

/*
 * Get a challenge from its id (or null if not found)
 */
function get_challenge(id) {
    return challenges[id - 1] ? challenges[id - 1] : null;
}

/*
 * Create a new team and return the team's id
 */
function create_team(name) {
    teams.push({
        name: name,
        points: 0,
    });
    return teams.length;
}

/*
 * Get all teams
 */
function get_teams() {
    return teams;
}

/*
 * Get a team from their id (or null if not found)
 */
function get_team(id) {
    return teams[id - 1] ? team[id - 1] : null;
}

/*
 * Get a team's id from their name (or null if not found)
 */
function get_team_id_from_name(name) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name === name) return i;
    }
    return null;
}

/*
 * Record a new solve
 */
function create_solve(challenge_id, team_id) {
    // TODO: prevent duplicate solves
    solves.push({
        challenge_id: challenge_id,
        team_id: team_id,
        timestamp: Date.now(),
    });
    challenges[challenge_id - 1].solves++;
    teams[team_id - 1].points += challenges[challenge_id - 1].points;
}

module.exports = {
    create_challenge,
    get_challenges,
    get_challenge,
    create_team,
    get_teams,
    get_team,
    get_team_id_from_name,
    create_solve,
};
