// 导入处理路径的path核心模块
const path = require('path')
// 导入数据库
const db = require('../db/index')
// 发布新文章的处理函数
exports.addArticle = (req,res)=>{
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // todo：表单数据合法，继续后面的处理流程
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id都存放在req.body中
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads',req.file.filename),
    pub_date:new Date(),
    // 文章作者的Id：这是一个有权限的接口，当登录成功后我们可以获取user.id作为作者的id
    author_id:req.user.id
  }
  const sql = `insert into ev_articles set ?`
  db.query(sql,articleInfo,(err,results)=>{
    // 执行SQL 语句失败
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')

    res.cc('发布文章成功！',0)
  }
  )
};
//获取文章的所有列表数据
exports.showAll = (req,res)=>{
  const sql = `select * from ev_articles where is_delete = 0 order by Id asc`
  db.query(sql,(err,results)=>{
    if (err) return res.cc(err)
    // 执行sql语句成功
    res.send({
      status:0,
      message:'获取文章的列表数据成功！',
      data:results
    })
  }
  )
};
exports.deleteArticleById = (req,res)=>{
  const sql = `update ev_articles set is_delete = 1 where Id = ?`
  db.query(sql,req.params.id,(err,results)=>{
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除Id为'+req.params.id+'的文章数据失败')
    res.cc('删除Id为'+req.params.id+'的文章数据成功！',0)
  }
  )
};
exports.getArticleById = (req,res)=>{
  const sql = `select * from ev_articles where id=?`
  db.query(sql,req.params.id,(err,results)=>{
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章数据失败')
    res.send({
      status:0,
      message:'获取文章内容成功！',
      data:results[0]
    })
  }
  )
};
exports.updateArticleById = (req,res)=>{
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // todo：表单数据合法，继续后面的处理流程
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id都存放在req.body中
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads',req.file.filename),
  }
  const sql = `update ev_articles set ? where Id = ?`
  db.query(sql,[articleInfo,req.body.Id],(err,results)=>{
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章数据失败！')
    res.cc('更新文章数据成功！',0)
  }
  )
};


