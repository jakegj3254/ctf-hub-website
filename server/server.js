
// Modules and Constants
/*INFO: May be required for future, commented out for now  
 * const path = require('path') 
  */
const express = require('express')
const pug = require('pug')

const port = process.env.PORT || 3000


// Initialize moduels+setup functions
var app = express()

// Set render engine, pug files need to be within views folder
app.set('view engine', 'pug')



app.get('/', function(req, res) {
  res.render('index')
})

// Express static serving
app.use('/', express.static('static'))




// Server Listen
app.listen(port, function() {
  console.log("== Server is listening on port", port)
})
