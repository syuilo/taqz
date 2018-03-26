const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')
const      inquirer = require('inquirer')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node mstdn/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node mstdn/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

require('../scripts/get_accounts')(argv, taqz, 'id')
.then(async accounts => {
    const status = await require('../scripts/get_text')(argv, taqz)
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        const client = {
            "access_token" : account.access_token
        }
        require('./scripts/toot')( client, status, account )
    }
})
.catch(err => { throw err })
