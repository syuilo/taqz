const inquirer = require('inquirer')
const argv = require('minimist')(process.argv.slice(1))

let taqz = {}, form = []

try{
    taqz.misskey = require('./misskey/taqz.json')
    const choices = taqz.misskey.accounts.map(account => account['name_domain'])
    form.push({
        type: 'checkbox',
        name: 'misskey',
        message: `Misskey :`,
        choices: choices
    })
} catch(e) {
    taqz.misskey = null
}

try{
    taqz.twitter = require('./twitter/taqz.json')
    const choices = taqz.twitter.accounts.map(account => account['screen_name'])
    form.push({
        type: 'list',
        name: 'twitter',
        message: `Twitter :`,
        choices: choices
    })
} catch(e) {
    taqz.twitter = null
}

try{
    taqz.mstdn = require('./mstdn/taqz.json')
    const choices = taqz.mstdn.accounts.map(account => account['id'])
    form.push({
        type: 'checkbox',
        name: 'mstdn',
        message: `Mastodon :`,
        choices: choices
    })
} catch(e) {
    taqz.mstdn = null
}
if(!argv.t){
    form.push({
        type: 'edit',
        name: 'text',
        message: '本文 :'
    })
}

if(!argv.h || argv.notag){
    form.push({
        type: 'edit',
        name: 'tags',
        message: 'タグ (カンマ","区切り):'
    })
}

inquirer.prompt(form).then(as => {
    let tagstr = ''
    if(!argv.notag){
        let tagarr = ( as.tags || (argv.h ? ( argv.h === true ? '' : argv.h ) : '')).split(',')
        if(as.tags != '' && argv.h !== true){
            for(i = 0; i < tagarr.length; i++){
                tagstr = tagstr + '\n#' + tagarr[i]
            }
        }
    }
    if(as.misskey && as.misskey.length > 0) require('./misskey/post' )({ n: as.misskey.join(','), text: ( as.text || argv.t ), tags: ( as.tags || '' ) })
    if(as.twitter && as.twitter.length > 0) require('./twitter/tweet')({ n: as.twitter, t: ( as.text || argv.t ) + tagstr })
    if(as.mstdn   && as.mstdn.length   > 0) require('./mstdn/toot'   )({ n: as.mstdn.join(','),   t: ( as.text || argv.t ) + tagstr })
})
