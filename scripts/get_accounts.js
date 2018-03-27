const      inquirer = require('inquirer')

async function get_username(argv, taqz, q){
    if(argv.id) return argv.id.split(',')
    else if(argv.username) return argv.username.split(',')
    else if(argv.screen_name) return argv.screen_name.split(',')
    else if(argv.n) return argv.n.split(',')
    else {
        const choices = taqz.accounts.map(account => account[q])
        let form = [
            {
                type: 'checkbox',
                name: q,
                message: `アカウント :`,
                choices: choices,
                default: taqz.accounts[0][q]
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as[q]
        }, err => { throw err })
    }
}

module.exports = function(argv, taqz, q){
    return get_username(argv, taqz, q).then(userid => {
        const accounts = taqz.accounts.filter((val, i, arr) => {
            for(n = 0; n < userid.length; n++){
                if(val[q] == userid[n]) return true
            }
            return false
        })
        if(accounts.length == 0) throw Error(`該当するアカウントはひとつもありませんでした。`)
        else return accounts
    })
}