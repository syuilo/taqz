const      inquirer = require('inquirer')

async function get_tags(argv, taqz){
    if(argv.tags) return argv.tags
    else if(argv.hashtags) return argv.hashtags
    else if(argv.h) return argv.h
    else {
        let form = [
            {
                type: 'input',
                name: 'tags',
                message: 'tags :'
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as.tags
        }, err => { throw err })
    }
}

module.exports = function(argv, taqz){
    return get_tags(argv, taqz)
    .then(tags => {
        return tags.split(',')
    })
}