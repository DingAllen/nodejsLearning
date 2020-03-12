const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            //reject('都不是POST请求处理个鸡儿')
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            //reject('不是JSON格式的数据，不好意思这道题我不会算')
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                //reject('么得数据')
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req, res) => {

    res.setHeader('Content-type', 'application/json')

    getPostData(req).then(postData => {

        req.body = postData

        // 处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由，返回404
        res.writeHead(404, {
            'Content-type': 'text/plain'
        })
        res.write('404 Not Found\n')
        res.end()
    })
}

module.exports = serverHandle