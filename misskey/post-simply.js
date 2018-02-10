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

async function get_username(argv, taqz){
    if(argv.id) return argv.id
    else if(argv.username) return argv.username
    else if(argv.n) return argv.n
    else {
        let form = [
            {
                type: 'input',
                name: 'username',
                message: 'username :'
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as.username
        }, err => { throw err })
    }
}

async function get_text(argv, taqz){
    if(argv.file && require('file-exists')(argv.file)) return readFile(argv.file, 'utf8')
    if(argv.path && require('file-exists')(argv.path)) return readFile(argv.path, 'utf8')
    if(argv.f && require('file-exists')(argv.f)) return readFile(argv.f, 'utf8')
    else if(argv.text) return argv.text.replace('\\n', '\n')
    else if(argv.body) return argv.body.replace('\\n', '\n')
    else if(argv.t) return argv.t.replace('\\n', '\n')
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


get_username(argv, taqz)
.then(userid => {
    const userid_arr = userid.split(',')
    const accounts = taqz.accounts.filter((val, i, arr) => {
        for(n = 0; n < userid_arr.length; n++){
            if(val.username == userid_arr[n]) return true
        }
        return false
    })
    if(accounts.length == 0) throw Error(`該当するアカウントはひとつもありませんでした。`)
    else return accounts
}).then(async accounts => {
    const text = await get_text(argv, taqz)
    for(n = 0; n < accounts.length; n++){
        const account = accounts[n]
        request.post('https://api.misskey.xyz/posts/create', {json: {i: account.i, text: text}}, (err) => {
            if(err) throw err
            else{
                console.log(`\n✔  投稿しました。 @${account.username}`)
                console.log(text)
            }
        })
    }
})
.catch(err => { throw err })

