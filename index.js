// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2');
const session = require('express-session');
require('dotenv').config();
// Create the express application object
const expressSanitizer = require('express-sanitizer');
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

app.use(expressSanitizer());
// Define our application-specific data
app.locals.shopData = {shopName: "Cassie's Classes"}

// Make user session available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.userDetails || null;
    next();
});

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /classes
const classesRoutes = require('./routes/classes')
app.use('/classes', classesRoutes)


// Define the database connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;




// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))