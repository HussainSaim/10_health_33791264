// Create a new router
const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    let newrecord = []
    
    
    if (req.query.search) {
        sqlquery = "SELECT * FROM books WHERE name LIKE ?";
        newrecord = ['%' + req.query.search + '%']
    }
    
    
    if (req.query.sort === 'name') {
        sqlquery += " ORDER BY name";
    }
    else if (req.query.sort === 'price') {
        sqlquery += " ORDER BY price";
    }
    
    // Execute the sql query
    db.query(sqlquery, newrecord, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router
