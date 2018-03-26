const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

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
    require('./scripts/tweet')( client, status, account )
})
.catch(err => { throw err })
