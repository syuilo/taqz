const      inquirer = require('inquirer')

async function get_username(argv, taqz, q){
    if(argv.id) return argv.id
    else if(argv.username) return argv.username
    else if(argv.screen_name) return argv.screen_name
    else if(argv.n) return argv.n
    else {
        let form = [
            {
                type: 'input',
                name: q,
                message: `${q} :`
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
        const userid_arr = userid.split(',')
        const accounts = taqz.accounts.filter((val, i, arr) => {
            for(n = 0; n < userid_arr.length; n++){
                if(val[q] == userid_arr[n]) return true
            }
            return false
        })
        if(accounts.length == 0) throw Error(`該当するアカウントはひとつもありませんでした。`)
        else return accounts
    })
}