// 导入express
const express= require('express')
// 创建路由对象
const router = express.Router()
const article_handler = require('../router_handler/article')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const { add_article_schema,delete_cate_schema,getListById_cate_schema ,update_ListById_cate_schema} =require('../schema/article')
// 导入解析 fromdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({dest: path.join(__dirname,'../uploads')})
// 发布新文章
router.post('/add',upload.single('cover_img'),expressJoi(add_article_schema),article_handler.addArticle)
// 获取文章的列表数据
router.get('/list',article_handler.showAll)
// 根据Id删除文章数据
router.get('/delete/:id',expressJoi(delete_cate_schema),article_handler.deleteArticleById)
// 根据Id获取文章数据
router.get('/:id',expressJoi(getListById_cate_schema),article_handler.getArticleById)
// 根据Id更新文章数据
router.post('/edit',upload.single('cover_img'),expressJoi(update_ListById_cate_schema),article_handler.updateArticleById)
//向外共享路由对象
module.exports = router
