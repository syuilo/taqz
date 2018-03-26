console.log(`
node mstdn/<command>
  instance  ･･････ インスタンスを登録します。いちばんはじめに実行してください。
  account   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  list      ･･････ 操作可能なアカウントIDを表示します。
  toot-simply (options)
            ･･････ 単純にツイートできます。
    (options)
        --id=, --screen_name=, -n <screen_name>
            スクリーンネーム@サーバーを事前に設定できます。
            カンマ(,)区切りで複数アカウントを指定できます。
        --file=, --path=, -f <filename>
            ファイル名を指定し、その内容を投稿できます。
        --text=, --body=, -s <text>
            本文を直接指定します。

  help      ･･････ このコマンドです。
`)
