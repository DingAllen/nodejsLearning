const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const {
    set,
    get
} = require('./src/db/redis')

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString
}

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

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val
    });

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }

    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {

        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    }).then(postData => {

        req.body = postData

        // 处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {

                if (needSetCookie) {
                    res.setHeader(
                        'Set-Cookie',
                        `userid=${userId}; path=/; httpOnly`)
                }

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

                if (needSetCookie) {
                    res.setHeader(
                        'Set-Cookie',
                        `userid=${userId}; path=/; httpOnly`)
                }

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