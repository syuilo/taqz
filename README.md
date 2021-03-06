# taqz

Misskey、TwitterおよびMastodonの、コマンドラインで動く簡単なクライアントです。

## Tips

- ファイルからの投稿を除き、本文で"\n"を挿入すると改行になります。

## Commands

### Root

- `node post`  
  複数のサービスにわたって同時に投稿できます。
  * (options)
    * `-t <本文>`
    * `-h <タグ(,区切り)>`

### Misskey

- `node misskey/<command>`
  * `instance`  ･･････ インスタンスを登録します。いちばんはじめに実行してください。
  * `account`   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  * `list`      ･･････ 操作可能なアカウントIDを表示します。
  * `post-simply (options)`  
            ･･････ 単純に投稿できます。
    * (options)
      *  `--id=, --username=, -n <username>`  
            ユーザーネーム(ID)を事前に設定できます。
            カンマ,区切りで複数アカウントを指定できます。
      *  `--file=, --path=, -f <filename>`  
            ファイル名を指定し、その内容を投稿できます。
      *  `--text=, --body=, -t <text>`  
            本文を直接指定します。

  * `help`      ･･････ この内容を表示します。


### Twitter

**複数のアカウントで同時に呟くことはできません。**

- `node twitter/<command>`
  * `init`      ･･････ いちばんはじめに実行するコマンドです。
  * `account`   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  * `list`      ･･････ 操作可能なアカウントIDを表示します。
  * `tweet-simply (options)`  
            ･･････ 単純にツイートできます。
    * (options)
      *  `--id=, --screen_name=, -n <screen_name>`  
            スクリーンネームを事前に設定できます。
            カンマ,区切りで複数アカウントを指定できます。
      *  `--file=, --path=, -f <filename>`  
            ファイル名を指定し、その内容を投稿できます。
      *  `--text=, --body=, -s <text>`  
            本文を直接指定します。

  * `help`      ･･････ この内容を表示します。


### Mastodon

- `node mstdn/<command>`
  * `instance`  ･･････ インスタンスを登録します。いちばんはじめに実行するコマンドです。
  * `account`   ･･････ 操作したいアカウントを追加するときに実行するコマンドです。
  * `list`      ･･････ 操作可能なアカウントIDを表示します。
  * `toot-simply (options)`  
            ･･････ 単純にトゥートできます。
    * (options)
      *  `--id=, --screem_name=, -n <username>`  
            ユーザーネーム(ID@インスタンスドメイン)を事前に設定できます。
            カンマ,区切りで複数アカウントを指定できます。
      *  `--file=, --path=, -f <filename>`  
            ファイル名を指定し、その内容を投稿できます。
      *  `--text=, --body=, -t <text>`  
            本文を直接指定します。

  * `help`      ･･････ この内容を表示します。