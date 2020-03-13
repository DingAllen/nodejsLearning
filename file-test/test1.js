const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'data.txt')

// 读取文件内容
fs.readFile(filename, (err,data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data.toString())
})

// 写入文件内容
const content = '这是新写入的内容\n'
const opt = {
    flag: 'a' // 追加写入，而‘w’是覆盖写入
}
fs.writeFile(filename, content, opt, err => {
    if (err) {
        console.error(err)
    }
})