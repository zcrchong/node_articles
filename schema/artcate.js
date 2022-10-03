// 导入定义验证规则的模块
const joi = require('joi')
// 定义分类名称和分类别名的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}
// 定义 分类ID 的校验规则
const id = joi.number().integer().min(1).required()
// 校验规则对象 删除分类
exports.delete_cate_schema = {
    params: {
        id,
    }
}
// 根据id获取文章数据
exports.get_cate_schema = {
    params:{
        id
    }
}
// 更新分类
exports.update_cate_schema = {
    body: {
        Id:id,
        name,
        alias
    }
}

