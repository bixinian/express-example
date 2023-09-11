const express = require('express')
const app = express()
const userRouter = require('./router/user')
const globalRouter = require('./router/global')
const session = require('express-session')

// 静态资源
app.use(express.static(('public'),{index:"login.html"}));

// 跨域解决
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('application/json;charset=utf-8');
    next();
});


//session中间件
app.use(session({
    secret: 'bilibili',
    resave: false,
    saveUninitialized: true
}));

//导入路由
app.use('/api', userRouter)
app.use(globalRouter)


app.listen(80, function() {
    console.log('server running at http://127.0.0.1:80')
})