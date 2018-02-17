const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      inquirer = require('inquirer')
const     writeFile = promisify(fs.writeFile)

let form = [
    {
        type: 'input',
        name: 'consumer_key',
        message: 'Comsumer Key:'
    },
    {
        type: 'input',
        name: 'consumer_secret',
        message: 'Comsumer Secret:'
    }
]
console.log('\n電話番号を認証したアカウントでログインした状態で https://apps.twitter.com/ にアクセスし、アプリを作成してください。\nそして、以下の情報を貼り付けてください。')
inquirer.prompt(form)
.then(as => {
    let data = {
        consumer_key: as.consumer_key.trim(),
        consumer_secret: as.consumer_secret.trim(),
        accounts: []
    }
    return writeFile('twitter/taqz.json', JSON.stringify(data), 'utf8', () => {
        console.log('taqz.jsonが作成されました。このファイルは絶対に誰にも見せないでください。')
        console.log('node twitter/account を実行し、アカウントを追加してください。\n')
    })
})
.catch(err => { throw err })