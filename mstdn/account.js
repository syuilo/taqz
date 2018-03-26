const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      Mastodon = require('mastodon-api')
const     writeFile = promisify(fs.writeFile)
const      inquirer = require('inquirer')

const taqz = require('./taqz.json') || null

if(!taqz) throw Error('初期化されていません。 node mstdn/init を実行し、初期化してください。')

let baseUrl, id

let form = [
    {
        type: 'input',
        name: 'baseUrl',
        message: 'Instance Domain :'
    }
]
console.log('インスタンスのドメインを入力します。')
inquirer.prompt(form)
.then(as => {
    baseUrl = as.baseUrl
    if(!taqz.instances[as.baseUrl]) throw Error('指定されたインスタンスはありませんでした。 node mstdn/instance を実行し、インスタンスを登録してください。')
    return Mastodon.getAuthorizationUrl(taqz.instances[as.baseUrl].app.client_id, taqz.instances[as.baseUrl].app.client_secret, `https://${baseUrl}` )
})
.then(url => {
    console.log('\n以下のURLにアクセスしてください。\n')
    console.log(url + '\n')
    console.log('取得した認証コードを入力してください。')
    let form = [
        {
            type: 'input',
            name: 'code',
            message: 'Oauth Code :'
        }
    ]
    return inquirer.prompt(form)
})
.then(as => {
    return Mastodon.getAccessToken(taqz.instances[baseUrl].app.client_id, taqz.instances[baseUrl].app.client_secret, as.code, `https://${baseUrl}`)
})
.then(async access_token => {
    let rtaqz = require('./taqz.json')
    let form = [
        {
            type: 'input',
            name: 'id',
            message: 'ID :'
        }
    ]
    console.log('\n任意の識別文字列(ID)を入力します。スクリーンネームを入力するとよいでしょう。アカウントを指定するとき「ID@ドメイン」と指定してトゥートなどをします。')
    let as = await inquirer.prompt(form)
    id = as.id
    rtaqz.accounts.push({
        id: `${as.id}@${baseUrl}`,
        baseUrl: baseUrl,
        access_token: access_token
    })
    return writeFile('mstdn/taqz.json', JSON.stringify(rtaqz), 'utf8')
})
.then(ok => {
    console.log(`アカウント情報を登録しました。投稿などを行う際は、${id}@${baseUrl}のように指定してください。`)
    return void(0)
})
.catch(e => { throw Error(e) })
