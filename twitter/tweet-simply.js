const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')
const      inquirer = require('inquirer')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

require('../scripts/get_accounts')(argv, taqz, 'screen_name')
.then(async accounts => {
    const status = await require('../scripts/get_text')(argv, taqz)
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        const client = {
            "consumer_key" : taqz.consumer_key,
            "consumer_secret" : taqz.consumer_secret,
            "access_token_key" : account.token,
            "access_token_secret": account.token_secret
        }
        require('./scripts/post')( client, status )
        client.post('statuses/update', {status: status}, (err) => {
            if(err) throw err
            else{
                console.log(`\n✔ 投稿しました。 @${account.screen_name}`)
                console.log(status)
            }
        })
    }
})
.catch(err => { throw err })
