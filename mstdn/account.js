const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      Mastodon = require('mastodon-api')
const     writeFile = promisify(fs.writeFile)
const      inquirer = require('inquirer')

let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node mstdn/instance を実行し、初期化してください。')
}

let domain, id

let form = [
    {
        type: 'list',
        name: 'domain',
        message: 'Instance Domain :',
        choices: Object.keys(taqz.instances)
    }
]
console.log('インスタンスのドメインを入力します。')
inquirer.prompt(form)
.then(as => {
    domain = as.domain
    if(!taqz.instances[as.domain]) throw Error('指定されたインスタンスはありませんでした。 node mstdn/instance を実行し、インスタンスを登録してください。')
    return Mastodon.getAuthorizationUrl(taqz.instances[as.domain].app.client_id, taqz.instances[as.domain].app.client_secret, `https://${domain}` )
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
    return Mastodon.getAccessToken(taqz.instances[domain].app.client_id, taqz.instances[domain].app.client_secret, as.code, `https://${domain}`)
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
    let ii = rtaqz.accounts.findIndex((val, i, arr) =>{
        return val.id == perm_data.id
    })
    if(ii >= 0){
        rtaqz.accounts.splice(ii, 1)
        console.log('同じ名前のアカウントが見つかりました。アカウントへのアクセス権は上書きされます。')
    }
    rtaqz.accounts.push({
        id: `${as.id}@${domain}`,
        domain: domain,
        access_token: access_token
    })
    return writeFile('mstdn/taqz.json', JSON.stringify(rtaqz), 'utf8')
})
.then(ok => {
    console.log(`アカウント情報を登録しました。投稿などを行う際は、${id}@${domain}のように指定してください。`)
    return void(0)
})
.catch(e => { throw Error(e) })
