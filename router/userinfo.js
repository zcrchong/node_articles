// 导入express
const express = require('express')
//创建路由对象
const router = express.Router()
// 导入用户信息的处理函数模块
const userinfo_handle = require('../router_handler/userinfo')
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
const {update_userinfo_schema,update_password_schema,update_avatar_schema} = require('../schema/user')
// 获取用户的基本信息
router.get('/userinfo',userinfo_handle.getUserInfo)

// 更新用户的基本信息
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handle.updateUserInfo)
// 重置密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handle.updatePassword)
// 更新用户头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema), userinfo_handle.updateAvatar)
//向外共享路由对象
module.exports = router
