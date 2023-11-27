
// Modules and Constants
/*INFO: May be required for future, commented out for now  
 * const path = require('path') 
  */
const express = require('express')
const pug = require('pug')

const port = process.env.PORT || 3000


// Initialize moduels+setup functions
var express_app = express()






// Express static serving
express_app.use('/', express.static('static'))




// Server Listen
express_app.listen(port, function() {
  console.log("== Server is listening on port", port)
})
