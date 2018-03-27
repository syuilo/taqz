const       Twitter = require('twitter')
module.exports = function(keys, status, account){
    return new Promise(function(resolve, reject){
        const client = new Twitter(keys)
        client.post('statuses/update', {status: status}, (err) => {
            if(err) reject(err)
            else{
                console.log(`\n✔ [Twitter]  投稿しました。 @${account.screen_name}`)
                console.log(status)
                resolve(status)
            }
        })
    })
}