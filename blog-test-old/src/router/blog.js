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

// 统一的登录验证函数
const loginCheck = (req) => {

    if (req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

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

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        body.author = req.session.username

        return newBlog(body).then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

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

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const author = req.session.username

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