const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const       request = require('request')
const            qs = require('querystring')
const      inquirer = require('inquirer')
const        crypto = require('crypto')

const taqz = require('./taqz.json') || null

if(!taqz) throw Error('初期化されていません。 node misskey/init を実行し、初期化してください。')

let session = {}

request.post('https://api.misskey.xyz/auth/session/generate', { json: { 'app_secret': taqz.app_secret } },
    function(e, r, generate){
        
        if(e) throw Error(e)
        console.log('以下のURLにアクセスしてください。\n')
        console.log(generate.url + '\n')
        let form = [
            {
                type: 'list',
                name: 'yn',
                message: '操作が完了したらEnterを押して続行します。nを選択すると中止します。 :',
                choices: ['y','n']
            }
        ]
        inquirer.prompt(form)
        .then(as => {
            if(as.yn == 'n') { console.log('操作を中止します'); return void(0) }
            request.post('https://api.misskey.xyz/auth/session/userkey', { json: {'app_secret': taqz.app_secret, 'token': generate.token} }, function (e, r, userkey) {

                const hashit = crypto.createHash('sha256')
                hashit.update(`${userkey.access_token}${taqz.app_secret}`)
                const i = hashit.digest('hex')

                let rtaqz = require('./taqz.json')
                rtaqz.accounts.push({
                    i: i,
                    username: userkey.user.username,
                    id: userkey.user.id
                })
                fs.writeFile('misskey/taqz.json', JSON.stringify(rtaqz), 'utf8', (err) => { if(err) throw err })
                console.log(`アカウント情報を登録しました。投稿などを行う際は、現在のユーザーネーム${userkey.screen_name}を指定してください。`)
            })
        })
        .catch(err => { throw err })
})
