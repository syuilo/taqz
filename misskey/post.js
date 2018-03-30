const       request = require('request')

let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node misskey/init を実行し、初期化してください。')
}
if(taqz.accounts.length == 0) throw Error('アカウントがありません。node misskey/account を実行し、アカウントを登録してください。')

function post(argv){
    require('../scripts/get_accounts')(argv, taqz, 'name_domain')
    .then(async accounts => {
        const text = await require('../scripts/get_text')(argv, taqz)
        const tags = await require('../scripts/get_tags')(argv, taqz)
        let arg = []
        for(n = 0; n < accounts.length; n++){
            const account = accounts[n]
            let json = {i: account.i, text: text}
            if(tags != null) json.tags = tags
            arg.push(new Promise(function(resolve, reject){
                request.post('https://api.misskey.xyz/posts/create', {json: json}, (err) => {
                    if(err) reject(err)
                    else{
                        console.log(`\n✔ [Misskey]  投稿しました。 @${account.name_domain}`)
                        console.log(text)
                        resolve(text)
                    }
                })
            }))
        }
        return Promise.all(arg)
    })
    .catch(err => { throw err })
}
module.exports = post