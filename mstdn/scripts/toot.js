const      Mastodon = require('mastodon-api')
module.exports = function(keys, status, account){
    const M = new Mastodon(keys)
    M.post(`https://${account.baseUrl}/api/v1/statuses`, { status: status }, (err) => {
        if(err) throw err
        else{
            console.log(`\n✔ 投稿しました。 @${account.id}`)
            console.log(status)
        }
    })
}