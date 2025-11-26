// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
    [
        check('username').notEmpty(),
        check('first').notEmpty(),
        check('last').notEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 8 })
    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register.ejs')
    }
    else {
        const saltRounds = 10
        const plainPassword = req.body.password
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            next(err)
        }
        else {
            let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)"
            let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword]
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    next(err)
                }
                else {
                    let message = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.body.email
                    message += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    res.send(message)
                }
            })
        }
    })
}
});


router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT id, username, firstName, lastName, email FROM users"; // query database to get all users (excluding passwords)
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("userlist.ejs", {availableUsers: result})
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedin', function (req, res, next) {
    // comparing form data with database
    const plainPassword = req.body.password
    const username = req.body.username
    
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err)
        }
        else if (result.length === 0) {
            res.send('Login failed! Username not found.')
        }
        else {
            // Extract the hashed password from database
            const hashedPassword = result[0].hashedPassword
            const firstName = result[0].firstName
            // Compare the plain password with the hashed password from database
            bcrypt.compare(req.body.password, hashedPassword, function(err, isPasswordCorrect) {
                if (err) {
                    next(err)
                }
                else if (isPasswordCorrect) {
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;
                    // Redirect to home page after successful login
                    res.redirect('/');
                }
                else {
                    res.send('Login failed! Incorrect password.')
                    // res.redirect('/users/login')
                }
            })
        }
    })
});

// Export the router object and redirectLogin so index.js and other routes can access it
module.exports = router
module.exports.redirectLogin = redirectLogin
