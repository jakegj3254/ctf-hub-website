
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

app.get('/', function(req, res) {
    res.render('index')
})
app.get('/challenge/1', async function(req, res) {
    res.send(compiledChallengeInfo(await db.get_challenge(1)))
})
// Express static serving
app.use('/', express.static('static'))




// Server Listen
app.listen(port, function() {
    console.log("== Server is listening on port", port)
})
