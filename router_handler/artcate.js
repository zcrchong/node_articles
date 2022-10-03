// 获取文章分类列表数据的处理函数
// 导入数据库操作模块
const db = require('../db/index')
exports.getArticleCates = (req,res)=>{

    // 根据分类的状态 获取所有未被删除的分类列表数据
    // is_delete  为0表示没有被标记为删除的数据
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql,(err,results)=>{
        //1.执行sql语句失败
        if (err) return res.cc(err)
        //2. 执行sql语句成功
        res.send({
            status:0,
            message:'获取文章分类列表成功！',
            data:results
        })
    }
    )

};
exports.addArticleCates = (req,res)=>{
    // 定义查询 分类名称 与 分类别名 是否被占用的SQL语句
    const sql = `select * from ev_article_cate where name = ? or alias = ?`
    db.query(sql,[req.body.name,req.body.alias],(err,results)=>{
        // 执行SQL语句失败
        if (err) return res.cc(err)

        //分类名称和分类别名都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')
        //todo:定义新增文章分类的SQL语句
        const addSql = `insert into ev_article_cate set ?`
        db.query(addSql,req.body,(err,results)=>{
          // sql语句执行失败
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功！',0)
        }
        )
    }
    )
};
exports.deleteCateById = (req,res)=>{
    const sql = `update ev_article_cate set is_delete = 1 where id = ?`
    db.query(sql,req.params.id,(err,results)=>{
        //执行SQL语句失败
        if (err) return res.cc(err)
        // sql语句执行成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        // 删除文章分类成功！
        res.cc('删除文章分类成功！',0)
    }
    )
};
exports.getArticleCateById = (req,res)=>{
    const sql = `select * from ev_article_cate where id=?`
    db.query(sql,req.params.id,(err,results)=>{
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')

        //把数据响应给客户端
        res.send({
            status: 0,
            message:'获取文章分类数据成功！',
            data:results[0]
        })
    }
    )
};
exports.updateCateById = (req,res)=>{
    const sql = `select * from ev_article_cate where Id<>? and (name = ? or alias = ?)`
    db.query(sql,[req.body.Id,req.body.name,req.body.alias],(err,results)=>{
        //执行sql语句失败
        if (err) return res.cc(err)
        // 分类名称和分类别名都被占用
        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        //TODO:更新文章分类
        const sql = `update ev_article_cate set ? where Id = ?`
        db.query(sql,[req.body,req.body.Id],(err,results)=>{
            if (err) return res.cc(err)
            // SQL语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败')
            // 更新文章分类成功
            res.cc('更新文章分类成功！',0)
        }
        )
        }
    )
};


