---
layout: post
title: "Windows 10・11と.NET Frameworkの標準搭載バージョン一覧"
description: "Windows 10・11とIoT Enterpriseに標準搭載される.NET Frameworkのバージョンを一覧にまとめます。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-10 22:00:00 +0900
categories: [Windows]
tags: [.NET Framework, Windows 10, Windows 11, IoT]
---

Windowsに標準搭載される.NET Frameworkは、OSのバージョンによって異なります。Windows 10・11とIoT Enterpriseの対応をまとめます。

**表は標準搭載版です。後から更新されている場合、実際にはこれより新しい版が入っていることがあります。** また、OSや.NET Frameworkのサポート期間を示す表ではありません。

## Windows 10

| Windows 10のバージョン | 標準搭載.NET Framework |
|---|---|
| 1507 | 4.6 |
| 1511 | 4.6.1 |
| 1607 | 4.6.2 |
| 1703 | 4.7 |
| 1709 | 4.7.1 |
| 1803／1809 | 4.7.2 |
| 1903／1909 | 4.8 |
| 2004／20H2 | 4.8 |
| 21H1／21H2／22H2 | 4.8 |

Windows 10は、**1903以降なら.NET Framework 4.8を標準搭載**しています。

### Windows 10 IoT Enterprise（LTSB／LTSC）

| 製品 | ベースのWindows 10 | OSビルドの先頭 | 標準搭載.NET Framework |
|---|---|---|---|
| IoT Enterprise LTSB 2015 | 1507 | 10240 | 4.6 |
| IoT Enterprise LTSB 2016 | 1607 | 14393 | 4.6.2 |
| IoT Enterprise LTSC 2019 | 1809 | 17763 | 4.7.2 |
| IoT Enterprise LTSC 2021 | 21H2 | 19044 | 4.8 |

IoT Enterpriseのリリースと、ベースOSの.NET Framework標準搭載版を対応付けています。Windows 10 IoT Coreは別製品です。

## Windows 11

| Windows 11のバージョン | 標準搭載.NET Framework |
|---|---|
| 21H2（初期版） | 4.8 |
| 22H2 | 4.8.1 |
| 23H2 | 4.8.1 |
| 24H2 | 4.8.1 |
| 25H2 | 4.8.1 |

Windows 11は、**初期版が4.8、22H2以降の上記バージョンは4.8.1**です。21H2も後から4.8.1へ更新できます。

Windows 11 IoT EnterpriseもベースOSに対応します。IoT Enterprise LTSC 2024は24H2ベースで、標準搭載は4.8.1です。

## .NET Framework 4.8と4.8.1

4.8.1の主な追加内容は、Windows 11でのArm64ネイティブ対応と、WinForms／WPFのアクセシビリティ改善などです。

| アプリの対象フレームワーク | 実行できるFramework |
|---|---|
| 4.8 | 4.8／4.8.1 |
| 4.8.1 | 4.8.1 |

4.8.1固有の機能を必要としなければ、アプリの対象を4.8に保つことで、4.8と4.8.1の両環境を対象にできます。.NET Framework 4.xはインプレース更新で、4.8と4.8.1を別々に並べてインストールする仕組みではありません。

## バージョンの確認方法

Windowsのバージョンは、**設定 → システム → 詳細情報（バージョン情報）→ Windowsの仕様**、または`winver`で確認できます。

インストール済み.NET Frameworkを正確に調べる場合は、コマンドプロンプトで次を実行します。

```bat
reg query "HKLM\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release
```

出力される`Release`値を、[Microsoftの対応表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/how-to-determine-which-versions-are-installed)と照合します。`reg query`の数値は通常16進数表示です。

.NET Frameworkは、.NET 8などの現行.NETとは別の製品です。また、C++/CLIではVC++ランタイムの条件も別途関係します。[Visual C++ランタイムとMSVCツールセットの対応]({{ '/articles/msvc-runtime-and-toolset-compatibility/' | relative_url }})も参照してください。

## 参考資料

確認日：2026-11-10。Windows 11の表は21H2～25H2の範囲です。

- [Microsoft：Windowsと.NET Frameworkの標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server)
- [Microsoft：Windows IoT Enterpriseリリース履歴](https://learn.microsoft.com/ja-jp/windows/iot/iot-enterprise/whats-new/release-history)
- [Microsoft：インストールされた.NET Frameworkの確認方法](https://learn.microsoft.com/ja-jp/dotnet/framework/install/how-to-determine-which-versions-are-installed)
- [Microsoft：.NET Framework 4.8.1の発表](https://devblogs.microsoft.com/dotnet/announcing-dotnet-framework-481/)
