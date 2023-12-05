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
 * Get a sorted list of challenges in a category
 *
 * Used in get_challenges
 */
async function get_sorted_category(category) {
    return (await client.query(`SELECT * FROM my_schema.challenges WHERE category = '${category}' ORDER BY points DESC`)).rows;
}

/*
 * Get all challenges
 */
async function get_challenges() {
    let results = {};
    results.crypto = await get_sorted_category('crypto');
    results.rev = await get_sorted_category('rev');
    results.pwn = await get_sorted_category('pwn');
    results.web = await get_sorted_category('web');
    results.misc = await get_sorted_category('misc');
    return results;
}

/*
 * Get a challenge from its id (or null if not found)
 */
async function get_challenge(id) {
    let result = await client.query('SELECT * FROM my_schema.challenges WHERE id = $1', [id]);
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
    let results = await client.query('SELECT * FROM my_schema.teams');
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
 * Record a new solve
 */
async function create_solve(challenge_id, team_id) {
    // Don't INSERT into solves directly, use CALL add_solve() so that
    // teams.points and challenges.solves are also updated
    await client.query('CALL my_schema.add_solve($1, $2);', [challenge_id, team_id]);
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
    create_solve,
};
