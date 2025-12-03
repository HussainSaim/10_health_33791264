// Create a new router
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


    router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })

router.get('/weather', (req, res, next) => {
    res.render('weather.ejs');
});

router.get('/weather/now', (req, res, next) => {
        let apiKey = 'cc3fcc22c3cf4120da47d702d0202a42'
        let city = req.query.city || 'london'
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                     
        request(url, function (err, response, body) {
          if(err){
            next(err)
          } else {
            var weather = JSON.parse(body)
            if (weather !== undefined && weather.main !== undefined) {
              var wmsg = 'It is '+ weather.main.temp + 
                ' degrees in '+ weather.name +
                '! <br> The humidity now is: ' + 
                weather.main.humidity;
              res.send(wmsg);
            } else {
              res.send("No data found");
            }
          } 
        });
});