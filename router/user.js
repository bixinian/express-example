const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "test",
})

conn.connect(function (err) {
    if (err) {
        console.log('数据库连接错误' + err.message)
        exit()
    } else console.log('数据库连接成功')
})

//解析前端传入的json数据中间件
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

//注册接口
router.post('/reg', function (req, res) {
    var username = req.body.username
    var password = req.body.password
    var qq = req.body.qq
    var pattern = /^[\w\u4e00-\u9fa5]{1,10}$/
    if (!(pattern.test(username) && pattern.test(password))) {
        res.send({ code: -1001, msg: "输入了不符合规定的字符" })
    } else {
        const sql = 'select * from user where username = ?'
        conn.query(sql, [username], function (err, result) {
            if (err) return err.message
            if (result.length > 0) {
                res.send({ code: -1, msg: "已存在该用户！" })
            } else {
                const insert = 'insert into user(username,qq,password) value(?,?,?)'
                conn.query(insert, [username, qq, password], function (err, result) {
                    if (err) return err.message
                    if (result.affectedRows > 0) {
                        res.send({ code: 0, msg: "注册成功！" })
                    } else {
                        res.send({ code: -2, msg: "注册失败" })
                    }
                })
            }

        })
    }
})

//登录接口
router.post('/login', function (req, res) {
    var username = req.body.username
    var password = req.body.password

    const sql = 'select * from user where username = ?'
    conn.query(sql, [username], function (err, result) {
        if (err) return err.message
        if (result.length == 0) {
            res.send({ code: -1, msg: '用户不存在！' })
        } else {
            const login = 'select * from user where username = ? and password = ?'
            conn.query(login, [username, password], function (err, result) {
                if (err) return err.message
                //console.log(result)
                if (result.length == '1') {
                    //对result进行数据处理
                    var info = JSON.parse(JSON.stringify(result));
                    //console.log(info[0].qq)
                    //将用户信息储存到session
                    req.session.user = {
                        username: username,
                        qq: info[0].qq
                    }
                    req.session.islogin = true

                    res.send({ code: '0', msg: '登录成功！' })
                } else {
                    res.send({ code: '-2', msg: '账户或密码错误！' })
                }
            })
        }
    })
})

// 用户信息接口
router.post('/userinfo', function (req, res) {
    if (req.session.islogin) {
        res.send({ code: 0, username: req.session.user.username, qq: req.session.user.qq })
    } else {
        res.send({ code: -1, msg: '用户未登录！' })
    }
})

// 更改密码接口
router.post('/resetpwd', function (req, res) {
    if (req.session.islogin) {
        const newpwd = req.body.newpwd
        const username = req.session.user.username
        var pattern = /^[\w\u4e00-\u9fa5]{1,20}$/
        if (!(pattern.test(newpwd))) {
            res.send({ code: -1001, msg: "输入了不符合规定的字符" })
        } else {
            const sql = 'update user set password = ? where username = ?'
            conn.query(sql, [newpwd, username], function (err, result) {
                if (err) return err.message
                if (result.affectedRows != 0) {
                    res.send({ code: 0, msg: '更改成功！' })
                } else {
                    res.send({ code: -1, msg: '更改失败！' })
                }
            })
        }
    } else {
        res.send({ code: -1, msg: '用户未登录！' })
    }
})

// 注销接口
router.post('/logout', (req, res) => {
    req.session.destroy()
    res.send({ code: 0, msg: '退出登录成功' })
})

// 导出用户信息
router.get('/userlist', function (req, res) {
    if (req.session.islogin) {
        var count = 0
        const countsql = 'select count(*) from user'
        conn.query(countsql, function (err, result) {
            console.log(result)
            var result = JSON.parse(JSON.stringify(result));
            count = result[0]['count(*)']
        })
        const lssql = 'select * from user'
        conn.query(lssql, function (err, result) {
            var result = JSON.parse(JSON.stringify(result));
            var rows = []
            result.forEach(function (info) {
                console.log(info)
                var userInfo = {
                    "id": info.id,
                    "username": info.username,
                    "qq": info.qq
                }
                rows.push(userInfo)
            })
            res.send({ total: count, rows })
        })
    } else {
        res.send({ code: -1, msg: "未登录" })
    }
})

module.exports = router