const getList = (author, keyword) => {

    return [{
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1234567890000,
            author: '薛源'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1234567890001,
            author: '沈奇'
        }
    ]
}

const getDetail = (id) => {

    return {
        id: 1,
        title: '标题A',
        content: '内容A',
        createTime: 1234567890000,
        author: '薛源'
    }
}

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title， content属性

    return {
        id: 1
    }
}

const updateBlog = (id, blogData = {}) => {

    return true
}

const deleteBlog = (id) => {

    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}