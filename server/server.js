
// Modules and Constants
/*INFO: May be required for future, commented out for now  
 * const path = require('path') 
 */
const express = require('express')
const pug = require('pug')

const db = require('./db.js');

const port = process.env.PORT || 3000


// Initialize moduels+setup functions
var app = express()

// Set render engine, pug files need to be within views folder
app.set('view engine', 'pug')

// Create some test data
const chal_1_id = db.create_challenge({
    name: "Fun Test",
    points: 100,
    description: "Testing the pug template for challenges",
    category: "misc",
    flag: "test{placeholder}",
});
const team_1_id = db.create_team("Team #1");
db.create_solve(chal_1_id, team_1_id);

const compiledChallengeInfo = pug.compileFile('./views/challenge-info.pug');

app.get('/', function(req, res) {
    res.render('index')
})
app.get('/challenge/1', function(req, res) {
    res.send(compiledChallengeInfo(db.get_challenge(1)))
})
app.get('/chals', function(req, res) {
    challenges = db.get_challenges()
    res.render('challenge-list', {
    challenges_test: challenges,
    categories: ["crypto", "rev", "pwn", "web", "misc"]
  })
})
// Express static serving
app.use('/', express.static('static'))




// Server Listen
app.listen(port, function() {
    console.log("== Server is listening on port", port)
})
