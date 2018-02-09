console.log(`
npm run <command>
  init      ･･････ いちばんはじめに実行するコマンドです。
  account   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  list      ･･････ 操作可能なアカウントIDを表示します。
  tweet-simply -- (options)
            ･･････ 単純にツイートできます。
    (options)
        --id=, --screen_name=, -n <screen_name>
            スクリーンネームを事前に設定できます。
        --file=, --path=, -f <filename>
            ファイル名を指定し、その内容を投稿できます。
        --text=, --body=, -s <text>
            本文を直接指定します。

  help      ･･････ このコマンドです。
`)