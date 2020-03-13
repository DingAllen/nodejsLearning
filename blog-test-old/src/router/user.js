const login = require('../controller/user')

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

const {
    set,
    get
} = require('../db/redis')

const handleUserRouter = (req, res) => {

    const method = req.method
    const url = req.url
    const path = url.split('?')[0]

    // 登录
    if (method === 'POST' && path === '/api/user/login') {

        const {
            username,
            password
        } = req.body

        return login(username, password).then(data => {
            if (data.username) {

                req.session.username = data.username
                req.session.realname = data.realname

                set(req.sessionID, req.session)

                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    // // 登录验证的测试
    // if (method === 'GET' && path === '/api/user/login-test') {

    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             username: req.cookie.username
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }
}

module.exports = handleUserRouter