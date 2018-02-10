const       Twitter = require('twitter')
module.exports = function(keys, status){
    const client = new Twitter(keys)
    client.post('statuses/update', {status: status}, (err) => {
        if(err) throw err
        else{
            console.log(`\n✔ 投稿しました。 @${account.screen_name}`)
            console.log(status)
        }
    })
}