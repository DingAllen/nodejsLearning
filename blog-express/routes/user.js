var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/login', (req, res, next) => {
    const {
        username,
        password
    } = req.body
    res.json({
        errno: 0,
        data: {
            username,
            password
        }
    });
});

module.exports = router;