const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const      minimist = require('minimist')
const       request = require('request')
const      inquirer = require('inquirer')
const     websocket = require('websocket')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

const display = {
    post: function(post){
        console.log(`\n${post.user.name} @${post.user.username}`)
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
        request.post('https://api.misskey.xyz/posts/timeline', {json: {i: account.i}}, (err, res, body) => {
            if(err) throw err
            else {
                body.reverse()
                for(i = 0; i < body.length; i++){
                    display.post(body[i])
                }
            }
        })

        const client = new websocket.client();

        client.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        })

        client.on('connect', function(connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            })
            connection.on('close', function() {
                console.log('echo-protocol Connection Closed');
            })
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    const data = JSON.parse(message.utf8Data)
                    if(data.type == 'post') display.post(data.body)
                }
            })

        })
        client.connect(`wss://api.misskey.xyz/?i=${account.i}`);
    }
})
.catch(err => { throw err })
