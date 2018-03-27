const taqz = require('./taqz.json')

console.log('利用可能なアカウント:')

for(let i = 0; i < taqz.accounts.length; i++){
    console.log(`   ${taqz.accounts[i].name_domain}`)
}

console.log('node misskey/account でアカウントを追加できます。')