const fileExists = require('file-exists')
const   inquirer = require('inquirer')

async function get_text(argv, taqz){
    if(argv.file && fileExists(argv.file)) return readFile(argv.file, 'utf8')
    if(argv.path && fileExists(argv.path)) return readFile(argv.path, 'utf8')
    if(argv.f && fileExists(argv.f)) return readFile(argv.f, 'utf8')
    else if(argv.text) return argv.text.replace('\\n', '\n')
    else if(argv.body) return argv.body.replace('\\n', '\n')
    else if(argv.t) return argv.t.replace('\\n', '\n')
    else if(argv.s) return argv.s.replace('\\n', '\n')
    else {
        let form = [
            {
                type: 'edit',
                name: 'text',
                message: '本文 :'
            }
        ]
        return inquirer.prompt(form)
        .then(as => {
            return as.text
        })
        .catch(err => { throw err })
    }
}

module.exports = get_text