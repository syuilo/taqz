const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      inquirer = require('inquirer')
const     writeFile = promisify(fs.writeFile)
const      Mastodon = require('mastodon-api')

let baseUrl

let form = [
    {
        type: 'input',
        name: 'baseUrl',
        message: 'Instance Domain:'
    },
    {
        type: 'input',
        name: 'name',
        message: 'App Name:',
        default: 'taqz'
    }
]
console.log('\nインスタンスのドメインと、アプリ名を入力します。')
inquirer.prompt(form)
.then(as => {
    baseUrl = as.baseUrl
    return Mastodon.createOAuthApp(`https://${as.baseUrl}/api/v1/apps`, as.name, 'read write follow')
})
.then(body => {
    let data = { instances: {}, accounts:[] }
    try{
        let taqz = require('./taqz.json')
        let pdata = { instances: {} }
        pdata.instances[baseUrl] = { app: body }
        data = Object.assign(taqz, pdata)
    } catch(e) {
        data.instances[baseUrl] = { app: body }
    }
    return writeFile('mstdn/taqz.json', JSON.stringify(data), 'utf8', () => {
        console.log('taqz.jsonが作成されました。このファイルは絶対に誰にも見せないでください。')
        console.log('node mstdn/account を実行し、アカウントを追加してください。\n')
    })
})
.catch(err => { throw err })