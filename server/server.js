
// Modules and Constants
/*INFO: May be required for future, commented out for now  
 * const path = require('path') 
 */
const express = require('express')
const pug = require('pug')
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

const compiledChallengeInfo = pug.compileFile('./views/challenge-info.pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    db.get_challenges().then(challenges => {
    res.render('challenge-list', {
    challenges: challenges,
    categories: ["crypto", "rev", "pwn", "web", "misc"],
    user: "Test"
  })
  })
})

app.get('/chals/:id', async function(req, res, next) {
    try {
        var chal = await db.get_challenge(parseInt(req.params.id))
        if (chal) res.send(compiledChallengeInfo(chal))
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

app.post('/chals/', function (req, res, next) {
    console.log(req.body)
    db.create_challenge({
        name: req.body.title,
        category: req.body.category,
        points: req.body.points,
        description: req.body.description,
        flag: req.body.flag
    })
    res.redirect('/chals/')
})


app.get('/scoreboard', function(req, res) {
  db.get_teams().then(teams => {
    teamsName = []
    teamsPoints = []
    for (x in teams) {
      teamsName.push(teams[x].name);
      teamsPoints.push(teams[x].points)
    }
    res.render('scoreboard', {
    teamList: teamsName,
    teamPoint: teamsPoints,
  })
  })

})

app.get("/login", function(req, res) {
  res.render("login")
})

// Express static serving
app.use('/', express.static('static'))



// Server Listen
app.listen(port, function() {
    console.log("== Server is listening on port", port)
})
