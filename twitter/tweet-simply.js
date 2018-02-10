const          util = require('util')
const     promisify = util.promisify
const            fs = require('fs')
const       Twitter = require('twitter')
const      minimist = require('minimist')
const      inquirer = require('inquirer')

const readFile = promisify(fs.readFile)

const taqz = require('./taqz.json')

if(!taqz) throw Error('初期化されていません。 node twitter/init を実行し、初期化してください。')
else if(taqz.accounts.length == 0) throw Error('アカウントがありません。node twitter/account を実行し、アカウントを登録してください。')

const argv = minimist(process.argv.slice(1))

async function get_screen_name(argv, taqz){
    if(argv.id) return argv.id
    else if(argv.screen_name) return argv.screen_name
    else if(argv.n) return argv.n
    else {
        let form = [
            {
                type: 'input',
                name: 'screen_name',
                message: 'screen_name :'
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as.screen_name
        }, err => { throw err })
    }
}

async function get_text(argv, taqz){
    if(argv.file && require('file-exists')(argv.file)) return readFile(argv.file, 'utf8')
    if(argv.path && require('file-exists')(argv.path)) return readFile(argv.path, 'utf8')
    if(argv.f && require('file-exists')(argv.f)) return readFile(argv.f, 'utf8')
    else if(argv.text) return argv.text.replace('\\n', '\n')
    else if(argv.body) return argv.body.replace('\\n', '\n')
    else if(argv.s) return argv.s.replace('\\n', '\n')
    else {
        let form = [
            {
                type: 'input',
                name: 'text',
                message: 'ツイート本文 :'
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as.text.replace('\\n', '\n')
        })
        .catch(err => { throw err })
    }
}


get_screen_name(argv, taqz)
.then(screen_names => {
    const screen_names_arr = screen_names.split(',')
    const accounts = taqz.accounts.filter((val, i, arr) => {
        for(n = 0; n < screen_names_arr.length; n++){
            if(val.screen_name == screen_names_arr[n]) return true
        }
        return false
    })
    if(accounts.length == 0) throw Error(`該当するアカウントはひとつもありませんでした。`)
    else return accounts
}).then(async accounts => {
    const status = await get_text(argv, taqz)
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        const client = new Twitter({
            "consumer_key" : taqz.consumer_key,
            "consumer_secret" : taqz.consumer_secret,
            "access_token_key" : account.token,
            "access_token_secret": account.token_secret
        })
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
