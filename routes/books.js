// Create a new router
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./users');
const { check } = require("express-validator");

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
     db.query(sqlquery, (err, result) => {
    if (err) {
        next(err)
            }
    res.render("list.ejs", {availableBooks:result})
         });
    });


    router.get('/addbook', redirectLogin, function (req, res, next) {
        res.render("addbook.ejs")
    });


    router.post('/bookadded', function (req, res, next) {           //after the form is submitted
    // saving data in database
    [check('name').notEmpty(),
    check('price').isFloat({ min: 0.01 })]
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.price)]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.sanitize(req.body.name) + ' price £'+  req.sanitize(req.body.price))
    })
}) 


// Export the router object so index.js can access it
module.exports = router
