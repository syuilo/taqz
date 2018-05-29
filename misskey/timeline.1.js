const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')
const       request = require('request')
const      inquirer = require('inquirer')
const     websocket = require('websocket')

const readFile = promisify(fs.readFile)
const taqz = (function(){
    try{
        return require('./taqz.json')
    } catch(e) {
        throw Error('初期化されていません。 node misskey/init を実行し、初期化してください。')
    }
})()
if(taqz.accounts.length == 0) throw Error('アカウントがありません。node misskey/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

const display = {
    post: function(post){
        console.log(`\n${post.user.name} @${post.user.username}`)
        if(post.text) console.log(post.createdAt)
        if(post.text) console.log(post.text)
        if(post.repost){
            console.log('   RE:')
            console.log(`   ${post.repost.user.name} @${post.repost.user.username}`)
            console.log('   ' + post.repost.text)
        }
    }
}

require('../scripts/get_accounts')(argv, taqz, 'username')
.then(async accounts => {
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        request.post('https://misskey.xyz/api/notes/timeline', {json: {i: account.i, untilDate: (new Date('2018-04-17T15:39:02.000Z')).getTime() }}, (err, res, body) => {
            if(err) throw err
            else {
                console.log(body)
                body.reverse()
                for(i = 0; i < body.length; i++){
                    display.post(body[i])
                }
            }
        })
    }
})
.catch(err => { throw err })
