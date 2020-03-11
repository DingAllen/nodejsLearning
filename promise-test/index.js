const fs = require('fs')
const path = require('path')

// // callback方式获取一个文件的内容
// function getFileContent(filename, callback) {
//     const fullFileName = path.resolve(__dirname, 'files', filename)
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.error(err)
//             return
//         }
//         callback(JSON.parse(data.toString()))
//     })
// }

// // 测试
// getFileContent('a.json', aData => {
//     console.log('a\'s data:', aData)
//     getFileContent(aData.next, bData => {
//         console.log('b\'s data:', bData)
//         getFileContent(bData.next, cData => {
//             console.log('c\'s data:', cData)
//         })
//     })
// })

// promise方式获取文件内容
function getFileContent(filename) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', filename)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(JSON.parse(data.toString()))
        })
    })
    return promise
}

// 测试
getFileContent('a.json').then(aData => {
    console.log('a\'s data:', aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log('b\'s data:', bData)
    return getFileContent(bData.next)
}).then(cData => {
    console.log('c\'s data:', cData)
}).catch(err => {
    console.error(err)
})