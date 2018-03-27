const            fs = require('fs')
const       request = require('request')
const            qs = require('querystring')
const      inquirer = require('inquirer')

let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
}

const oauth = {
    consumer_key: taqz.consumer_key,
    consumer_secret: taqz.consumer_secret
}

let session = {}

request.post('https://api.twitter.com/oauth/request_token',{ oauth: oauth },
    function(e, r, body){
        if(e) throw Error(e)
        const req_data = qs.parse(body)
        const uri = `https://api.twitter.com/oauth/authorize?${qs.stringify({oauth_token: req_data.oauth_token})}`
        console.log('以下のURLにアクセスしてください。認証するとpin番号が表示されますので、プロンプトにコピペしてEnterしてください。')
        console.log(uri)
        let form = [
            {
                type: 'input',
                name: 'pin',
                message: 'pin :'
            }
        ]
        inquirer.prompt(form)
        .then(as => {
            const oauth = {
                consumer_key: taqz.consumer_key,
                consumer_secret: taqz.consumer_secret,
                token: req_data.oauth_token,
                token_secret: req_data.oauth_token_secret,
                verifier: as.pin
            }
            request.post('https://api.twitter.com/oauth/access_token', { oauth: oauth }, function (e, r, body) {
                const perm_data = qs.parse(body)
                let rtaqz = require('./taqz.json')
                rtaqz.accounts.push({
                    user_id: perm_data.user_id,
                    screen_name: perm_data.screen_name,
                    token: perm_data.oauth_token,
                    token_secret: perm_data.oauth_token_secret
                })
                fs.writeFile('twitter/taqz.json', JSON.stringify(rtaqz), 'utf8', (err) => { if(err) throw err })
                console.log(`アカウント情報を登録しました。投稿などを行う際は、現在のスクリーンネーム${perm_data.screen_name}を指定してください。`)
            })
        })
        .catch(err => { throw err })
})
