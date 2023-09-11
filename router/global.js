const express = require('express')
const router = express.Router()

//登录状态重定向中间件
router.get('/login.html', function(req, res, next) {
    if (req.session.islogin) {
        return res.redirect('/index.html')
    }
    next()
})
router.get('/index.html', function(req, res, next) {
    if (!req.session.islogin) {
        return res.redirect('/login.html')
    }
    next()
})

module.exports = router