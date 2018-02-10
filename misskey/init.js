const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      inquirer = require('inquirer')
const     writeFile = promisify(fs.writeFile)

let form = [
    {
        type: 'input',
        name: 'app_secret',
        message: 'App Secret:'
    }
]
console.log('\nhttps://dev.misskey.xyz/apps にアクセスし、アプリを作成してください。\nそして、以下の情報を貼り付けてください。')
inquirer.prompt(form)
.then(as => {
    let data = {
        app_secret: as.app_secret,
        accounts: []
    }
    return writeFile('misskey/taqz.json', JSON.stringify(data), 'utf8', () => {
        console.log('taqz.jsonが作成されました。このファイルは絶対に誰にも見せないでください。')
        console.log('node misskey/account を実行し、アカウントを追加してください。\n')
    })
})
.catch(err => { throw err })