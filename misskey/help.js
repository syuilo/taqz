console.log(`
node misskey/<command>
  instance  ･･････ インスタンスを登録します。いちばんはじめに実行してください。
  account   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  list      ･･････ 操作可能なアカウントIDを表示します。
  tweet-simply (options)
            ･･････ 単純にツイートできます。
    (options)
        --id=, --username=, -n <username>
            ユーザーネーム(ID)を事前に設定できます。
            カンマ(,)区切りで複数アカウントを指定できます。
        --file=, --path=, -f <filename>
            ファイル名を指定し、その内容を投稿できます。
        --text=, --body=, -t <text>
            本文を直接指定します。

  help      ･･････ このコマンドです。
`)