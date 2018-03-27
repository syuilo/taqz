let taqz
try{
    taqz = require('./taqz.json')
} catch(e) {
    throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
}
if(taqz.accounts.length == 0) throw Error('アカウントがありません。node mstdn/account を実行し、アカウントを登録してください。')

function toot(argv){
    return require('../scripts/get_accounts')(argv, taqz, 'id')
    .then(async accounts => {
        const status = await require('../scripts/get_text')(argv, taqz)
        let arg = []
        for(n = 0; n < accounts.length; n++){
            const account = accounts[n]
            const client = {
                "access_token" : account.access_token
            }
            arg.push(require('./scripts/toot')( client, status, account ))
        }
        return Promise.all(arg)
    })
    .catch(err => { throw err })
}
module.exports = toot