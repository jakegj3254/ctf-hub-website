/*
 * Contains methods to perform basic database create/read operations
 *
 * Requires database parameters (PGUSER, PGHOST, PGDATABASE, PGPASSWORD, and
 *   PGPORT) to be set via environment variables or .env file at project root
 */

require('dotenv').config();
const { Client } = require('pg');
const client = new Client();

/*
 * Create a new challenge and return the challenge's id
 *
 * Chal object must contain: name, points, description, category, and flag
 */
async function create_challenge(chal) {
    let result = await client.query('INSERT INTO my_schema.challenges (name, category, points, description, flag) VALUES($1, $2, $3, $4, $5) RETURNING id;', [
        chal.name, chal.category, chal.points, chal.description, chal.flag
    ]);
    return result.rows[0].id;
}

/*
 * Get all challenges
 */
async function get_challenges(team_id) {
    let results = {};
    results.crypto = (await client.query('SELECT * FROM my_schema.get_category($1, $2);', ['crypto', team_id])).rows;
    results.rev = (await client.query('SELECT * FROM my_schema.get_category($1, $2);', ['rev', team_id])).rows;
    results.pwn = (await client.query('SELECT * FROM my_schema.get_category($1, $2);', ['pwn', team_id])).rows;
    results.web = (await client.query('SELECT * FROM my_schema.get_category($1, $2);', ['web', team_id])).rows;
    results.misc = (await client.query('SELECT * FROM my_schema.get_category($1, $2);', ['misc', team_id])).rows;
    return results;
}

/*
 * Get a challenge from its id (or null if not found)
 */
async function get_challenge(challenge_id, team_id) {
    let result = await client.query('SELECT * FROM my_schema.get_challenge($1, $2);', [challenge_id, team_id]);
    return result.rows.length === 1 ? result.rows[0] : null;
}

/*
 * Create a new team and return the team's id
 */
async function create_team(name) {
    let result = await client.query('INSERT INTO my_schema.teams (name) VALUES($1) RETURNING id;', [name]);
    return result.rows[0].id;
}

/*
 * Get all teams
 */
async function get_teams() {
    let results = await client.query('SELECT * FROM my_schema.teams ORDER BY name ASC');
    return results.rows;
}

/*
 * Get a team from their id (or null if not found)
 */
async function get_team(id) {
    let result = await client.query('SELECT * FROM my_schema.teams WHERE id = $1', [id]);
    return result.rows.length === 1 ? result.rows[0] : null;
}

/*
 * Get a team's id from their name (or null if not found)
 */
async function get_team_id_from_name(name) {
    let result = await client.query('SELECT id FROM my_schema.teams WHERE name = $1', [name]);
    return result.rows.length === 1 ? result.rows[0].id : null;
}

/*
 * Submit a flag, returns boolean indicating whether flag is correct
 */
async function submit_flag(challenge_id, team_id, flag) {
    return (await client.query('SELECT * FROM my_schema.submit_flag($1, $2, $3)', [challenge_id, team_id, flag])).rows[0].submit_flag;
}

module.exports = {
    client,
    create_challenge,
    get_challenges,
    get_challenge,
    create_team,
    get_teams,
    get_team,
    get_team_id_from_name,
    submit_flag,
};
