
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

function to_int(value, default_value) {
    let parsed = parseInt(value);
    return isNaN(parsed) ? default_value : parsed;
}

// Initialize moduels+setup functions
var app = express()

// Set render engine, pug files need to be within views folder
app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use((req, res, next) => {
    req.team_id = to_int(req.cookies.team_id, null)
    next()
})

app.get('/', async function(req, res) {
    try {
        res.render('challenge-list', {
            challenges: await db.get_challenges(req.team_id),
            team: await db.get_team(req.team_id),
            categories: ["crypto", "rev", "pwn", "web", "misc"],
        })
    } catch(err) {
        next(err)
    }
})

app.get('/chals/:id', async function(req, res, next) {
    try {
        let chal_id = to_int(req.params.id, null)
        let chal = await db.get_challenge(chal_id, req.team_id)
        if (chal) {
            res.render('challenge-info', {
                ...chal,
                team: await db.get_team(req.team_id),
            })
        } else {
            // Challenge not found
            next();
        }
    } catch (err) {
        next(err)
    }
})
app.get('/chals', function(req, res) {
   res.redirect("/") 
    
})

app.get('/chals/new', function(req, res) {
  res.render("challenge-new")
})

app.post('/chals/', async function (req, res, next) {
    try {
        // Create challenge
        let chal_id = await db.create_challenge({
            name: req.body.title,
            category: req.body.category,
            points: req.body.points,
            description: req.body.description,
            flag: req.body.flag
        })
        res.redirect(`/chals/${chal_id}`)
    } catch (err) {
        next(err)
    }
})


app.get('/scoreboard', async function(req, res) {
    try {
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
    } catch (err) {
        next(err)
    }
})

app.get("/login", async function(req, res) {
    try {
        res.render("login", {
            team: await db.get_team(req.team_id),
            teams: await db.get_teams(),
        })
    } catch (err) {
        next(err)
    }
})
app.post('/login', async function(req, res, next) {
    try {
        let team_id = await db.get_team_id_from_name(req.body.name);
        if (team_id == null) {
            // Team not found, create new team
            team_id = await db.create_team(req.body.name);
        }
        res.cookie('team_id', team_id);
        res.redirect('/chals/')
    } catch (err) {
        next(err)
    }
})
app.get("/logout", function(req, res) {
    res.clearCookie('team_id')
    res.redirect('/chals/')
})

// Express static serving
app.use('/', express.static('static'))

// 404 / 500 error handling
app.use((req, res, next) => {
    res.status(404).render('error', { message: '404 Not Found' })
})
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).render('error', { message: '500 Internal Server Error' })
});

// Server Listen
app.listen(port, function() {
    console.log("== Server is listening on port", port)
})
