const            fs = require('fs')
const       request = require('request')
const      inquirer = require('inquirer')
const        crypto = require('crypto')

let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
}

let session = {}


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
    request.post(`https://api.${as.domain}/auth/session/generate`, { json: { 'app_secret': taqz.instances[as.domain] } },
    function(e, r, generate){
        if(e) throw e
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
        .then(as2 => {
            if(as2.yn == 'n') { console.log('操作を中止します'); return void(0) }
            request.post(`https://api.${as.domain}/auth/session/userkey`, { json: {'app_secret': taqz.instances[as.domain], 'token': generate.token} }, function (e, r, userkey) {
                if(e) throw e
                const hashit = crypto.createHash('sha256')
                hashit.update(`${userkey.access_token}${taqz.instances[as.domain]}`)
                const i = hashit.digest('hex')

                let rtaqz = require('./taqz.json')
                rtaqz.accounts.push({
                    i: i,
                    username: userkey.user.username,
                    name_domain: `${userkey.user.username}@${as.domain}`,
                    domain: as.domain,
                    id: userkey.user.id
                })
                fs.writeFile('misskey/taqz.json', JSON.stringify(rtaqz), 'utf8', (err) => { if(err) throw err })
                console.log(`アカウント情報を登録しました。投稿などを行う際は、${userkey.user.username}@${as.domain} と指定してください。`)
            })
        })
        .catch(err => { throw err })
    })

})