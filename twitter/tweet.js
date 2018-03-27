let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
}

if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')

function tweet(argv){
    require('../scripts/get_accounts')(argv, taqz, 'screen_name')
    .then(async accounts => {
        if(accounts.length > 1) console.log('複数のアカウントで同じツイートをすることは禁止されています。')
        const status = await require('../scripts/get_text')(argv, taqz)
        const account = accounts[0]
        const client = {
            "consumer_key" : taqz.consumer_key,
            "consumer_secret" : taqz.consumer_secret,
            "access_token_key" : account.token,
            "access_token_secret": account.token_secret
        }
        return require('./scripts/tweet')( client, status, account )
    })
    .catch(err => { throw err })
}
module.exports = tweet