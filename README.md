# 技術ノート

Windows・.NETを中心とした公開用技術ブログです。GitHub PagesとJekyllを使い、記事をMarkdownで管理します。

公開予定URL：<https://khf05137.github.io/tech-notes/>

## 初回公開

1. 初期構築のPull Requestで記事と設定を確認し、`main` へマージします。
2. リポジトリの **Settings → Pages** を開きます。
3. **Build and deployment → Source** で **Deploy from a branch** を選びます。
4. **Branch** を `main`、フォルダを `/ (root)` にして **Save** を押します。
5. Actionsのビルド・公開が完了したら、Pages設定の **Visit site** から表示を確認します。
6. 職場のブラウザからも閲覧できるか確認します。

本リポジトリの `Build and check` ワークフローはビルド検証用です。公開はPagesのブランチ公開機能が担当します。Sourceで **GitHub Actions** を選ぶ構成ではありません。

## 記事を追加する

1. `templates/post.md` を参考に、`_posts/YYYY-MM-DD-slug.md` を作成します。
2. 冒頭のタイトル、説明、日時、カテゴリ、タグを設定し、本文を書きます。
3. 作業用ブランチからPull Requestを作り、原稿と `Build and check` の結果を確認します。
4. `main` へマージすると、Pagesが自動更新されます。

記事のURLは `/articles/slug/` です。ファイル名の日付を変えても、slugを変えなければURLは変わりません。公開済み記事では、原則としてslugを維持してください。未来の日付の記事はその日時に達しても自動ビルドされないため、予約公開は別途仕組みが必要です。

画像は `assets/images/` などへ追加し、Markdownでは次のように参照します。

```liquid
![画像の説明]({{ '/assets/images/example.png' | relative_url }})
```

## 内容の確認

- 単独で読めるよう、目的・対象環境・手順・確認方法・参考資料を記載します。
- 具体的なPC名・IP・ユーザー名・ファイルパスは説明用のものに置き換えます。
- 画像に含まれる個人情報や組織固有の情報も確認します。
- 公式資料による説明と、実機での確認・未検証部分を区別します。
- 原本の非公開ナレッジや秘密情報を、このリポジトリへ追加しません。

**公開リポジトリでは、作業ブランチ・Pull Request・変更履歴も公開されます。** Jekyllの `exclude` や `published: false` はサイト表示を制御するもので、GitHub上で非公開にする設定ではありません。公開できない下書きは別の非公開の場所で管理します。

## サイト設定

`_config.yml` の `title`、`description`、`author` で表示を変更できます。URLの基点は `url: https://khf05137.github.io` と `baseurl: /tech-notes` です。

カテゴリ一覧は記事の `categories` から自動生成します。トップページの検索は記事のタイトル・説明・タグが対象です。記事の見出しから目次を作成し、同じカテゴリの記事が増えると関連記事を表示します。JavaScriptが無効でも本文・記事一覧・カテゴリは閲覧できます。

外部フォント・CDN・アクセス解析は使用していません。

## ローカルで確認する場合（任意）

GitHub上だけでも更新できます。ローカル確認をする場合はRubyとBundlerを用意し、次を実行します。

```sh
bundle install
bundle exec jekyll serve
```

表示先：<http://127.0.0.1:4000/tech-notes/>

ビルドと内部リンクの確認：

```sh
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
```

ビルド確認では、生成されたHTMLのローカルリンク・アセットとアンカーを確認します。外部サイトの到達性やWindows操作そのものの検証は行いません。

## 公式資料

- [GitHub Pagesサイトの作成](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Pagesの公開元の設定](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pagesの依存関係](https://pages.github.com/versions/)
