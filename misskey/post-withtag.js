const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')
const       request = require('request')
const      inquirer = require('inquirer')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')



const argv = minimist(process.argv.slice(1))

require('../scripts/get_accounts')(argv, taqz, 'username')
.then(async accounts => {
    const text = await require('../scripts/get_text')(argv, taqz)
    const tags = await require('../scripts/get_tags')(argv, taqz)
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        request.post('https://api.misskey.xyz/posts/create', {json: {i: account.i, text: text, tags: tags}}, (err) => {
            if(err) throw err
            else{
                console.log(`\n✔  投稿しました。 @${account.username}`)
                console.log(text)
            }
        })
    }
})
.catch(err => { throw err })

