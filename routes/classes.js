// Create a new router
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./users');
const { check } = require("express-validator");


router.get('/', function(req, res, next) {
    let sqlquery = "SELECT * FROM classes ORDER BY class_datetime";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('classes.ejs', {
            shopData: req.app.locals.shopData,
            availableClasses: result
        });
    });
});

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    const term = req.sanitize(req.query.search_text || '');

    const sqlquery = "SELECT * FROM classes WHERE title LIKE ? OR category LIKE ? OR location LIKE ?";
    const values = ['%' + term + '%', '%' + term + '%', '%' + term + '%'];

    db.query(sqlquery, values, function (err, result) {
        if (err) return next(err);
        res.render("classes.ejs", { availableClasses: result, search: term });
    });
});

// Display booking form (protected route)
router.get('/booking', redirectLogin, function (req, res, next) {
    // Get all available classes
    let sqlquery = "SELECT * FROM classes ORDER BY class_datetime";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("booking.ejs", { 
                availableClasses: result,
                username: req.session.userId 
            });
        }
    });
});

// Process the booking (protected route)
router.post('/booked', redirectLogin, function (req, res, next) {
    const classId = req.body.class_id;
    const userId = req.session.userDetails.id;
    
    // Insert booking with user_id from session
    let sqlquery = "INSERT INTO bookings (class_id, user_id) VALUES (?, ?)";
    let newBooking = [classId, userId];
    
    db.query(sqlquery, newBooking, (err, result) => {
        if (err) {
            next(err);
        } else {
            // Get class details to show confirmation
            let classQuery = "SELECT * FROM classes WHERE id = ?";
            db.query(classQuery, [classId], (err, classResult) => {
                if (err) {
                    next(err);
                } else {
                    const bookedClass = classResult[0];
                    res.send(`<h2>Booking Confirmed! you have successfully booked:${bookedClass.title}</h2>`);
                }
            });
        }
    });
});

router.get('/addclass', redirectLogin,function (req, res, next) {
    res.render("addclass.ejs")
});

router.post('/classadded', function (req, res, next) {
    [check('title').notEmpty().withMessage('Title is required'),
    check('level').notEmpty().withMessage('Level is required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('class_datetime').notEmpty().withMessage('Date & Time is required')]
    check('capacity').notEmpty().withMessage('Capacity is required')

    let sqlquery = "INSERT INTO classes (title, category, level, location, class_datetime, capacity) VALUES (?, ?, ?, ?, ?, ?)";
    let newClass = [req.sanitize(req.body.title), req.sanitize(req.body.category), req.sanitize(req.body.level), req.sanitize(req.body.location), req.sanitize(req.body.class_datetime), req.sanitize(req.body.capacity)];  
    db.query(sqlquery, newClass, (err, result) => {
        if (err) {
            next(err); 
        } else {
            res.send('<h2>New class added successfully!</h2>'); 
        }
    });
});
// Export the router object so index.js can access it
module.exports = router
