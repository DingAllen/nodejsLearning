const loginCheck = (username, password) => {

    if (username === '薛源' && password === 'woshishabi') {
        return true
    }
    return false
}

module.exports = loginCheck