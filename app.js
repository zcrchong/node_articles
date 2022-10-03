//整个项目的入口文件
//引入express包
const express = require('express')
//引入cors跨域
const cors = require('cors')
const joi = require('joi')
//导入用户路由模块
const useRouter = require('./router/user')
//创建express服务器实例
const app = express()
//配置解析表单元素的中间件：注意只能解析application/x-www-form-urlencoded格式的表单数据中间件
app.use(express.urlencoded({ extended :false}))
//使用cors跨域中间件
app.use(cors())

//声明一个全局中间件，为res对象挂载一个res.cc()函数
//响应数据的中间件
app.use(function (req,res,next) {
    // status=0为成功；status = 1为失败；默认将status的值设置为
    res.cc = function(err,status = 1){
      res.send({
          // 状态
          status,
          // 状态描述，判断err 是错误对象还是字符串
          message:err instanceof Error ? err.message : err,
      })

    }
    next()

})
//导入配置文件
const config = require('./config')
// 解析token的中间件
const expressJWT = require('express-jwt')
// 使用.unless({path: [/^\/api\//]})指定哪些接口不需要进行Token的身份认证
app.use(expressJWT({secret : config.jwtSecretKey}).unless({path:[/^\/api\//]}))
//注册用户路由模块
app.use('/api',useRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意： 以/my开头的接口，都是有权限的接口，需要Token进行身份验证
app.use('/my',userinfoRouter)
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/artcate',artCateRouter)
// 托管静态资源文件
app.use('/uploads',express.static('./uploads'))
// 为文章的路由挂载统一的访问前缀 /my/article
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)
// 路由之后定义错误级别的中间件
app.use((err,req,res,next) => {
    //数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError')return res.cc('身份认证失败')
    //未知错误
    res.cc(err)
})

//调用app.listen方法，指定端口号并启动web服务器
app.listen(3007,function () {
    console.log('api server running at http://127.0.0.1:3007')
})

