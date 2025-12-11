// routes for main pages
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./users')
const request = require('request')

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});


// Export the router object so index.js can access it
module.exports = router

router.get('/logout', redirectLogin, (req,res) => {         // Logout route
    req.session.destroy(err => {                       
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
});



