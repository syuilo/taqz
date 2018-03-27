const      Mastodon = require('mastodon-api')
module.exports = function(keys, status, account){
    return new Promise(function(resolve, reject){
        const M = new Mastodon(keys)
        M.post(`https://${account.domain}/api/v1/statuses`, { status: status }, (err, params) => {
            if(err) reject(err)
            else{
                console.log(`\n✔ [Mastodon] 投稿しました。 @${account.id}`)
                console.log(status)
                resolve(status)
            }
        })
    })
}