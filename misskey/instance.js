const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      inquirer = require('inquirer')
const     writeFile = promisify(fs.writeFile)

let domain

let form = [
    {
        type: 'input',
        name: 'domain',
        message: 'Instance Domain :',
        default: 'misskey.xyz'
    }
]
console.log('インスタンスのドメインを入力します。')
inquirer.prompt(form)
.then(as => {
    domain = as.domain
    let form = [
        {
            type: 'input',
            name: 'app_secret',
            message: 'App Secret:'
        }
    ]
    console.log(`\nhttps://dev.${domain}/apps にアクセスし、アプリを作成してください。\nそして、以下の情報を貼り付けてください。`)  // MISSKEY_AOI
    return inquirer.prompt(form)
})
.then(as => {
    let data = {
        instances: {},
        accounts: []
    }
    data.instances[domain] = as.app_secret
    return writeFile('misskey/taqz.json', JSON.stringify(data), 'utf8', () => {
        console.log('taqz.jsonが作成されました。このファイルは絶対に誰にも見せないでください。')
        console.log('node misskey/account を実行し、アカウントを追加してください。\n')
    })
})
.catch(err => { throw err })