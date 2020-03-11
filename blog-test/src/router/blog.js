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
    const id = query.id
    const body = req.body

    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {

        const author = query.author || ''
        const keyword = query.keyword || ''
        const listData = getList(author, keyword)

        return new SuccessModel(listData)
    }

    // 获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {

        const detailData = getDetail(id)

        return new SuccessModel(detailData)
    }

    // 新建一篇博客
    if (method === 'POST' && path === '/api/blog/new') {

        const blogData = newBlog(body)

        return new SuccessModel(blogData)
    }

    // 更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {

        const result = updateBlog(id, body)

        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新博客失败')
        }
    }

    // 删除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {

        const result = deleteBlog(id)

        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('删除博客失败')
        }
    }
}

module.exports = handleBlogRouter