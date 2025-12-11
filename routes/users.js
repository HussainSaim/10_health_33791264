// routes for user registration, login, dashboard
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/usr/375/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next) { // Display registration form
    res.render('register.ejs')
})

router.post('/registered',
    [
        check('username').notEmpty(),
        check('first').notEmpty(),
        check('last').notEmpty(),               //sanitise and validate inputs
        check('email').isEmail(),
        check('password').isLength({ min: 8 })
    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send('There were validation errors: ');     // If validation errors, re-render the registration form with error messages
        res.render('./register.ejs')
    }
    else {
        const saltRounds = 10
        const plainPassword = req.body.password
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {  // Hash the password
        if (err) {
            next(err)
        }
        else {
            let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)"
            let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword]  // SQL query to insert a new user
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    next(err)
                }
                else {
                    let message = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.body.email     // Confirmation
                    message
                    res.send(message)
                }
            })
        }
    })
}
});



router.get('/login', function (req, res, next) {    // Display login form
    res.render('login.ejs')
})

router.post('/loggedin', function (req, res, next) {
    // comparing form data with database
    const plainPassword = req.body.password
    const username = req.sanitize(req.body.username)    // Sanitize username input
    
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, result) => {           // SQL query to get user by username
        if (err) {
            next(err)
        }
        else if (result.length === 0) {
            res.send('Login failed! Username not found.')   // Username not found
        }
        else {
            // Extract the user data from database
            const user = result[0];
            const hashedPassword = user.hashedPassword;
            const firstName = user.firstName;
            // Compare the plain password with the hashed password from database
            bcrypt.compare(req.body.password, hashedPassword, function(err, isPasswordCorrect) {
                if (err) {
                    next(err)
                }
                else if (isPasswordCorrect) {
                    // Save user session here, when login is successful
                    req.session.userId = user.username;
                    req.session.userDetails = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    };
                    // Redirect to home page after successful login
                    res.redirect('/usr/375');
                }
                else {
                    res.send('Login failed! Incorrect password.')
                    // res.redirect('/users/login')
                }
            })
        }
    })
});


router.get('/dashboard', redirectLogin, function (req, res, next) {
    const userId = req.session.userDetails.id;
    
    // Get all bookings for this user with class details
    let sqlquery = `
        SELECT bookings.id as booking_id, classes.title, classes.category, classes.level,   
               classes.location, classes.class_datetime
        FROM bookings
        JOIN classes ON bookings.class_id = classes.id
        WHERE bookings.user_id = ?
        ORDER BY classes.class_datetime DESC`;  // SQL query to get bookings with class details for the logged-in user
    
    db.query(sqlquery, [userId], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('dashboard.ejs', { // Render dashboard with bookings
                bookings: result
            });
        }
    });
});



// Export the router object and redirectLogin so index.js and other routes can access it
module.exports = router
module.exports.redirectLogin = redirectLogin
