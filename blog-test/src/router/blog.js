const querystring = require('querystring')

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

const handleBlogRouter = (req, res) => {

    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])
    const id = query.id || -1
    const body = req.body

    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {

        const author = query.author || ''
        const keyword = query.keyword || ''

        return getList(author, keyword).then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {

        return getDetail(id).then(data => {
            return new SuccessModel(data)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && path === '/api/blog/new') {

        body.author = '俊霖无敌' // 假数据，待开发登录时再改为真实数据

        return newBlog(body).then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {

        return updateBlog(id, body).then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {

        const author = '俊霖无敌' // 假数据，待开发登录时再改成真实数据

        return deleteBlog(id, author).then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }
}

module.exports = handleBlogRouter