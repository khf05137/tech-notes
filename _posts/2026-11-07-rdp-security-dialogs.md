---
title: "WindowsのRDP接続で表示される4つの確認画面と対処方法"
description: "初回の注意画面、RDPファイルの発行元、資格情報、接続先証明書。それぞれが確認する対象と、設定を見直す手順を整理します。"
date: 2026-11-07 12:00:00 +0900
updated: 2026-11-07 12:00:00 +0900
categories: [Windows]
tags: [RDP, 証明書, グループポリシー, mstsc]
---

Windowsのリモートデスクトップ接続では、同じ接続操作でも、異なる目的の確認画面が続けて表示されることがあります。RDPファイルに署名しても、接続先の証明書警告が残るのは、それぞれが確認している対象が違うためです。

まずは画面を4種類に分けると、必要な設定を判断しやすくなります。

> **対象と確認時点**  
> Windows標準の `mstsc.exe` から `.rdp` ファイルを開く場合を対象に、2026年11月時点の資料と検証結果を整理しています。2026年4月・7月の更新による変更を含みます。Windowsのビルドや管理ポリシーによって表示・利用できる設定が異なります。

## 4つの画面は何を確認しているか

| 種類 | 代表的な表示 | 確認している対象 | 対処の方向 |
| --- | --- | --- | --- |
| 初回の注意画面 | リモートデスクトップ接続を開いています | RDPファイルによる接続を利用者が理解しているか | 内容を確認して初回に承諾する |
| 発行元・共有の確認 | 不明なリモート接続／このリモート接続の発行元を確認 | RDPファイルの発行元とローカルリソースの共有 | ファイルの署名、発行元の信頼、共有対象を確認する |
| 資格情報の入力 | 資格情報を入力してください | 接続先へログオンするユーザー | 保存資格情報と認証ポリシーを確認する |
| 接続先証明書の警告 | このリモートコンピューターのIDを識別できません | 接続先が提示するサーバー証明書 | 証明書の信頼・有効期限・接続先名を確認する |

すべてが毎回出るわけではなく、表示順も認証方式などの影響を受けます。

特に区別したいのは、**RDPファイルの署名用証明書と、接続先サーバーの証明書は別物**という点です。前者は「この設定ファイルを誰が配布したか」、後者は「今つながろうとしている相手は誰か」を確認します。

## 初回の注意画面

2026年4月のセキュリティ更新以降、更新後に初めてRDPファイルを開くと、フィッシングなどのリスクを説明する画面が表示されます。Microsoftの説明では、承諾後は同じアカウントで再表示されません。[公式資料：初回の注意画面](https://learn.microsoft.com/ja-jp/windows-server/remote/remote-desktop-services/remotepc/understanding-security-warnings#the-first-launch-dialog)

接続先とファイルの入手元を確認し、説明を読んで承諾します。RDPファイルに署名する作業とは別の確認です。

この画面を事前に承諾済みにする、サポートされた管理手順は本稿では確認できていません。初回操作が必要なものとして準備します。

## RDPファイルの発行元と共有を確認する

### 署名と共有許可の関係

新しい確認画面では、RDPファイルが要求するドライブやクリップボードなどの共有が、既定でオフになります。署名すると発行元を識別できますが、**署名しただけですべての確認が消えるわけではありません。**

署名済みファイルでは、発行元に対する共有の選択を記憶できます。この選択の記憶と、管理ポリシーで信頼済み発行元を指定することは、分けて考えます。

### 設定ファイルの例

次は、説明用アドレス `192.0.2.10` に接続する設定例です。接続先で利用するために必要な場合だけ、接続元のCドライブを共有しています。

```ini
full address:s:192.0.2.10
screen mode id:i:1
drivestoredirect:s:C:\;
redirectclipboard:i:0
authentication level:i:2
```

ドライブリダイレクトが許可されると、接続先のセッションから接続元のCドライブを `\\tsclient\C` として参照できます。ファイルに記載する共有要求と、実際に許可される共有は別であり、確認画面やポリシーの状態も影響します。

### 署名用証明書を準備する

検証用の自己署名証明書は、署名を行うWindows PCのPowerShellで次のように作成できます。

```powershell
$cert = New-SelfSignedCertificate `
    -Type CodeSigningCert `
    -Subject "CN=Example RDP Publisher" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -KeyAlgorithm RSA -KeyLength 2048 `
    -HashAlgorithm SHA256 `
    -NotAfter (Get-Date).AddYears(2)

Export-Certificate -Cert $cert -FilePath ".\RdpPublisher.cer"
$cert | Format-List Subject, Thumbprint, HasPrivateKey
```

バッククォートはPowerShellの改行継続記号です。行末に置き、後ろへ空白を追加しないようにします。

署名するPCには秘密鍵が必要です。接続元へ信頼を配布する際は、公開証明書の `.cer` を使います。秘密鍵付きの `.pfx` を接続元へ配る必要はありません。

組織で運用する場合は、既存の証明書発行・配布の方針に従います。自己署名証明書をルートストアへ登録すると信頼の起点が増えるため、検証対象を確認して登録します。

### rdpsignで署名する

`rdpsign` はWindowsに含まれるRDPファイル署名用ツールです。元ファイルを上書きするため、先にバックアップを取ります。

```powershell
$rdpFile = "C:\Rdp\connection.rdp"
Copy-Item $rdpFile "$rdpFile.bak"

# この指定方法は検証環境で成功したもの。下記の拇印に関する注記を参照。
rdpsign /sha256 $cert.Thumbprint /l /v $rdpFile
rdpsign /sha256 $cert.Thumbprint /v $rdpFile
```

`/l` はファイルを置き換えずにテストする指定、`/v` は詳細表示です。テストが成功したことを確認してから実際に署名します。署名後は `signscope:s:` と `signature:s:` が追加されます。

**拇印の指定には注意が必要です。** Microsoftの `rdpsign` の説明は `/sha256` にSHA-256の拇印を指定すると記載しています。一方、検証環境では証明書ストアの `$cert.Thumbprint`（40桁）を指定して署名できました。ツールのオプション名だけから入力値を決めず、使用するPCの `rdpsign /?` と `/l /v` の結果を確認してください。

ここで署名ツールへ渡す値と、後述の信頼済み発行元ポリシーに登録するSHA-256拇印を混同しないようにします。署名対象の設定を変更した場合は再署名します。[公式資料：rdpsign](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/rdpsign)

### 接続元で信頼を設定する

自己署名証明書を使う検証例では、接続元の現在ユーザーへ公開証明書を登録します。登録前に、署名元で確認した証明書と一致することを照合してください。

```cmd
certutil -user -addstore Root "RdpPublisher.cer"
certutil -user -addstore TrustedPublisher "RdpPublisher.cer"
```

GUIでは `Win + R` から `certmgr.msc` を開き、現在のユーザーの証明書ストアを確認できます。CA発行の証明書では、発行元CAを含む信頼チェーンを組織の方針に従って構成します。

### 信頼済み発行元のポリシーを設定する

接続元で `gpedit.msc` を開き、次の場所を確認します。

**コンピューターの構成 → 管理用テンプレート → Windowsコンポーネント → リモートデスクトップサービス → リモートデスクトップ接続クライアント**

対象は、信頼された `.rdp` 発行元の証明書拇印を指定するポリシーです。表示名はWindowsの更新や言語によって異なります。

2026年7月の更新以降、従来のSHA-1に加えてSHA-2の拇印へ対応しました。SHA-256などの拇印を、対象PCのポリシーヘルプに記載された形式とプレフィックスで登録します。

該当する署名済みファイルでは、発行元確認の警告が表示されず、ファイルが要求するリダイレクトが自動的に有効になります。そのため、信頼する署名者と共有対象を絞って設定します。[公式資料：RDPファイルのグループポリシー](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/manage-rdp-file-security-settings-with-group-policy)

## 資格情報の入力を省略する

接続元のWindows資格情報マネージャーに、接続先の資格情報を保存します。

GUIでは、**コントロールパネル → ユーザーアカウント → 資格情報マネージャー → Windows資格情報**を開きます。登録先の名前は `TERMSRV/接続先` です。

コマンドプロンプトでの登録例は次のとおりです。パスワードは引数に書かず、入力要求に応じて指定します。

```cmd
cmdkey /generic:TERMSRV/192.0.2.10 /user:device-b\Operator
cmdkey /list
```

削除する場合は次を使います。

```cmd
cmdkey /delete:TERMSRV/192.0.2.10
```

保存先はWindowsユーザーごとです。IPアドレスで接続するならIP、ホスト名ならホスト名と、実際に接続するときの名前を一致させます。接続先の認証設定や資格情報の委任ポリシーによっては、保存しても入力が必要です。[公式資料：cmdkey](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmdkey)

## 接続先サーバーの証明書警告を確認する

この画面で検証するのは、接続先のRDPサービスが提示する証明書です。RDPファイルの署名を設定しても、この証明書の問題は解決しません。

### 信頼の問題と名前の問題を分ける

| 問題 | 例 | 対処 |
| --- | --- | --- |
| 信頼されない発行元 | 接続先が自己署名証明書を使っている | 実際に提示された証明書を照合し、必要な信頼を構成する |
| 名前の不一致 | IPで接続しているが、証明書の対象名がホスト名だけ | 証明書の対象名で接続するか、接続に使う名前・IPに対応した証明書を用意する |
| 有効期限の問題 | 証明書の期限切れ、またはPCの時計が不正 | 証明書の更新と時刻を確認する |

例えば `192.0.2.10` で接続して、証明書が `device-b` という名前に対して発行されている場合、ルートストアへの登録だけでは名前の不一致が残ります。

対象名が `device-b` の証明書なら、DNSなどで名前解決を整え、次のように接続します。証明書のSANなどに、接続に使う名前が含まれるかも確認します。

```cmd
mstsc.exe /v:device-b
```

IPアドレスで接続を続ける場合は、IPアドレスをSANに持つ適切なサーバー証明書を用意し、接続先のRDPリスナーへ割り当てる方法があります。接続先側の変更が必要になるため、本稿では差し替え手順を扱いません。[公式資料：RDPリスナー証明書](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/remote-desktop-listener-certificate-configurations)

### 証明書ストアと例外記憶の違い

`certmgr.msc` は現在のユーザー、`certlm.msc` はローカルコンピューターの証明書を管理します。どのストアに登録するかを確認し、証明書は実際の接続で提示されたものと拇印を照合します。

「このコンピューターへの接続について今後確認しない」は、検証した接続先について例外を記憶する操作です。名前不一致や信頼チェーンそのものを修正する操作ではありません。証明書が更新された場合などには、再度の確認が必要になることがあります。

## regコマンドの設定はGPO編集と同じか

設定を配布するとき、`Policies` 配下へ `reg add` で値を書き込めば、`gpedit.msc` の操作を再現できるように見えることがあります。しかし、変更する対象が異なります。

| 操作 | 主に変更する対象 | ローカルGPOの設定状態 |
| --- | --- | --- |
| `gpedit.msc` や `LGPO.exe` | 管理用テンプレートの設定では `Registry.pol` などのポリシー定義 | 設定した内容が保存される |
| `reg add` | アプリが参照する実際のレジストリ値 | `Registry.pol` は更新しない |

そのため、レジストリに値が存在して動作が変わっていても、`gpedit.msc` では「未構成」のまま、という状態があり得ます。

`gpupdate /force` はポリシーを再適用するコマンドです。手動で書いたレジストリ値をGPOの定義へ取り込む機能ではありません。同じ値をGPOが管理している場合、再適用で上書きされる可能性があります。

現在の値を調べることと、その値を管理しているGPOを調べることも分けます。前者は `reg query`、後者は `gpresult` などで確認します。[公式資料：Registry.pol](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/policy/registry-policy-file-format)

## 設定後に確認すること

1. 利用するWindowsアカウントで初回の注意画面を確認する。
2. RDPファイルの発行元が期待する名前で表示されるか確認する。
3. 許可されたドライブやクリップボードが、必要な範囲と一致しているか確認する。
4. 保存資格情報が、実際に使う接続先名に対応しているか確認する。
5. 接続先証明書の信頼・名前・有効期限を確認する。

検証では、RDPファイルの署名、信頼済み発行元の設定による確認画面の省略、保存資格情報による入力の省略を確認しています。接続先証明書については、信頼の設定後もIP接続による名前不一致が残ることを確認しました。サーバー証明書の差し替えは、この検証には含めていません。

## 参考資料

- [Microsoft Learn：RDPファイルを開く際のセキュリティ警告](https://learn.microsoft.com/ja-jp/windows-server/remote/remote-desktop-services/remotepc/understanding-security-warnings)
- [Microsoft Learn：RDPファイルのグループポリシー](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/manage-rdp-file-security-settings-with-group-policy)
- [Microsoft Learn：rdpsign](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/rdpsign)
- [Microsoft Learn：cmdkey](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmdkey)
- [Microsoft Learn：RDPリスナー証明書](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/remote-desktop-listener-certificate-configurations)
- [Microsoft Learn：Registry Policy File Format](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/policy/registry-policy-file-format)
