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
console.log('電話番号を認証したアカウントでログインした状態で https://apps.twitter.com/ にアクセスし、アプリを作成してくださいそして、以下の情報をコピペしてください。')
inquirer.prompt(form)
.then(as => {
    let data = {
        consumer_key: as.consumer_key,
        consumer_secret: as.consumer_secret,
        accounts: []
    }
    return writeFile('taqz.json', JSON.stringify(data), 'utf8', () => {
        console.log('taqz.jsonが作成されました。このファイルは絶対に誰にも見せないでください。')
        console.log('npm run account を実行し、アカウントを追加してください。')
    })
})
.catch(err => { throw err })