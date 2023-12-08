
// Modules and Constants
/*INFO: May be required for future, commented out for now  
 * const path = require('path') 
 */
const express = require('express')
const pug = require('pug')
const cookieParser = require('cookie-parser');
const db = require('./db.js');

const port = process.env.PORT || 3000;

// Connect to database
(async () => {
    await db.client.connect();
})();

// Initialize moduels+setup functions
var app = express()

// Set render engine, pug files need to be within views folder
app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use((req, res, next) => {
    let team_id = parseInt(req.cookies.team_id)
    req.team_id = isNaN(team_id) ? null : team_id
    next()
})

app.get('/', async function(req, res) {
    res.render('challenge-list', {
        challenges: await db.get_challenges(req.team_id),
        team: await db.get_team(req.team_id),
        categories: ["crypto", "rev", "pwn", "web", "misc"],
    })
})

app.get('/chals/:id', async function(req, res, next) {
    try {
        let chal = await db.get_challenge(parseInt(req.params.id), req.team_id)
        if (chal) res.render('challenge-info', {
            ...chal,
            team: await db.get_team(req.team_id),
        })
        else next();
    } catch {
        next()
    }
})
app.get('/chals', function(req, res) {
   res.redirect("/") 
    
})

app.get('/chals/new', function(req, res) {
  res.render("challenge-new")
})

app.post('/chals/', async function (req, res, next) {
    // TODO: handle errors
    await db.create_challenge({
        name: req.body.title,
        category: req.body.category,
        points: req.body.points,
        description: req.body.description,
        flag: req.body.flag
    })
    res.redirect('/chals/')
})


app.get('/scoreboard', async function(req, res) {
    let teams = await db.get_teams();
    let teamsName = []
    let teamsPoints = []
    let currentTeam = null;
    for (x in teams) {
        teamsName.push(teams[x].name);
        teamsPoints.push(teams[x].points)
        if (teams[x].id == req.team_id) currentTeam = teams[x];
    }
    res.render('scoreboard', {
        team: currentTeam,
        teamList: teamsName,
        teamPoint: teamsPoints,
    })
})

app.get("/login", async function(req, res) {
  res.render("login", {
      team: await db.get_team(req.team_id),
  })
})
app.post('/login', async function(req, res, next) {
    // TODO: handle team not found
    let team_id = await db.get_team_id_from_name(req.body.name);
    res.cookie('team_id', team_id);
    res.redirect('/chals/')
})
app.get("/logout", function(req, res) {
    res.clearCookie('team_id')
    res.redirect('/chals/')
})

// Express static serving
app.use('/', express.static('static'))



// Server Listen
app.listen(port, function() {
    console.log("== Server is listening on port", port)
})
