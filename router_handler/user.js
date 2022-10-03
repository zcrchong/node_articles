/*
*   在这里定义与用户相关的路由处理函数，供/router/user.js 模块进行调用
* */
const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 用这个包来生成Token字符串
const jwt = require('jsonwebtoken')
const config = require('../config')
//注册用户的处理函数
exports.regUser = (req,res)=>{
    const userinfo = req.body
    //判断数据是否合法
    // if (!userinfo.username || !userinfo.password){
    //     return res.cc('用户名或密码不能为空！')
    // }
    //查找的mysql语句
    const sqlSel = `select * from ev_users where username=?`
    // 插入用户的mysql语句
    const sqlAdd = `insert into ev_users set ?`
    db.query(sqlSel,userinfo.username,function (err,results) {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }
        //用户名被占用
        if (results.length > 0){
            return res.cc('用户名被占用，请更换其他用户名')
        }
        //todo:用户名可用，继续后续的流程
       // console.log(userinfo.password)
        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        //console.log(userinfo.password)
        db.query(sqlAdd,{username:userinfo.username,password:userinfo.password}, function (err,results) {
            // 处理逻辑
            //执行SQL语句失败
            if (err) return res.cc(err)
            //执行SQL语句成功 但影响行数不为1
            if (results.affectedRows !== 1){
                return res.cc('注册用户失败，请稍后再试')
            }
            //注册成功
            res.cc('注册成功！',0)
        })
    })

    //res.send('reguser OK')

};

//登录的处理函数
exports.login = (req,res)=>{
    const userinfo = req.body
    const selSql = `select * from ev_users where username=?`
    db.query(selSql,userinfo.username,function (err,results) {
        //执行SQL语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功，但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
        //todo:判断用户输入的登录密码是否和数据库中的密码一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        //如果对比结果为false
        if (!compareResult){
            return res.cc('登录失败！')
        }
        //todo:登录成功，生成Token字符串
        // res.cc('登录成功！',0)
        const user = {...results[0],password:'',userpic:''}
        // console.log(user)
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{
            expiresIn:config.expiresIn //token有效期为十个小时
        })
        res.send({
            status:0,
            message:'登录成功！',
            // 为了方便客户端直接使用Token，在服务器上直接拼接上Bearer的前缀
            token: 'Bearer ' + tokenStr
        })
    })
};

