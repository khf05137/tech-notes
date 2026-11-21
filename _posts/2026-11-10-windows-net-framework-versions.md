---
layout: post
title: "Windows 10・11と.NET Frameworkの標準搭載バージョン一覧"
description: "Windows 10・11とIoT Enterpriseに標準搭載される.NET Frameworkのバージョンと、Visual Studioの標準構成で選べるターゲットをまとめます。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-18 00:00:00 +0900
categories: [Windows]
tags: [.NET Framework, Windows 10, Windows 11, IoT, Visual Studio]
---

Windowsに標準搭載される.NET Frameworkは、OSのバージョンによって異なります。Windows 10・11とIoT Enterpriseの標準搭載版に加え、Visual Studioの標準構成で選べるターゲットをまとめます。

**Windowsの表は標準搭載版です。後から更新されている場合、実際にはこれより新しい版が入っていることがあります。** また、OSや.NET Frameworkのサポート期間を示す表ではありません。

OSの標準搭載版より新しい.NET Framework 4.xを後からWindows更新プログラムとして導入した場合、その更新をアンインストールできることがあります。たとえば、Windows 10 1809向けの.NET Framework 4.8は削除可能です。[Microsoft Update Catalog（KB4486153、「Uninstall Notes」）](https://www.catalog.update.microsoft.com/ScopedViewInline.aspx?updateid=6b34ac14-4b34-4d0a-a640-1133e9e5baa7)

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

表の出典は[Microsoft LearnのWindows 10標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server#windows-10)の「.NET Framework が含まれています」列。

Windows 10は、**1903以降なら.NET Framework 4.8を標準搭載**しています。

### Windows 10 IoT Enterprise（LTSB／LTSC）

| 製品 | ベースのWindows 10 | OSビルドの先頭 | 標準搭載.NET Framework |
|---|---|---|---|
| IoT Enterprise LTSB 2015 | 1507 | 10240 | 4.6 |
| IoT Enterprise LTSB 2016 | 1607 | 14393 | 4.6.2 |
| IoT Enterprise LTSC 2019 | 1809 | 17763 | 4.7.2 |
| IoT Enterprise LTSC 2021 | 21H2 | 19044 | 4.8 |

ベースOSとビルド番号は[Microsoft LearnのWindows IoT Enterpriseリリース履歴](https://learn.microsoft.com/ja-jp/windows/iot/iot-enterprise/whats-new/release-history)、標準搭載の.NET Frameworkは[Microsoft LearnのWindows 10標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server#windows-10)に基づく。

Windows 10 IoT Coreは別製品です。

## Windows 11

| Windows 11のバージョン | 標準搭載.NET Framework |
|---|---|
| 21H2（初期版） | 4.8 |
| 22H2 | 4.8.1 |
| 23H2 | 4.8.1 |
| 24H2 | 4.8.1 |
| 25H2 | 4.8.1 |

表の出典は[Microsoft LearnのWindows 11標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server#windows-11)の「.NET Framework が含まれています」列。

Windows 11は、**初期版が4.8、22H2以降の上記バージョンは4.8.1**です。21H2も後から4.8.1へ更新できます。

Windows 11 IoT EnterpriseもベースOSに対応します。IoT Enterprise LTSC 2024は24H2ベースで、標準搭載は4.8.1です。

## Visual Studioと.NET Frameworkのターゲット対応

開発PCで.NET Framework 4.xを対象にC#／VBのWinFormsやWPFをビルドする場合の対応表。VS 2019以降は、Visual Studio Communityの初回セットアップで「.NETデスクトップ開発」を選び、必須（Required）と推奨（Recommended）のコンポーネントを含める構成を前提とする。判定には、各バージョンの参照アセンブリを提供するTargeting Packの同梱状況を使う。VS 2015／2017は、当時のリリース資料で確認できた版を示す。

| Visual Studio | 標準構成で選べる.NET Framework 4.x | 根拠 |
|---|---|---|
| 2015（初期版／Update 1） | 初期版で4.6、Update 1で4.6.1の同梱を確認 | [初期版のリリースノート](https://learn.microsoft.com/ja-jp/visualstudio/releases/2015/vs2015-rtm-vs)・[Update 1のリリースノート](https://learn.microsoft.com/ja-jp/visualstudio/releases/2015/vs2015-update1-vs) |
| 2017（15.8） | 4.7.2の開発ツールの提供を確認 | [Microsoftの15.8リリースノート](https://learn.microsoft.com/ja-jp/visualstudio/releases/2017/vs2017-relnotes-v15.8#net-framework-472) |
| 2019（16.11） | 4.0、4.5、4.5.1、4.5.2、4.6、4.6.1、4.7.2 | [Microsoftの2019コンポーネント一覧](https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/install/includes/vs-2019/workload-component-id-vs-community.md#net-desktop-development) |
| 2022（17.14） | 4.7.2、4.8 | [Microsoftの2022コンポーネント一覧](https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/install/includes/vs-2022/workload-component-id-vs-community.md#net-desktop-development) |
| 2026（18.0） | 4.7.2、4.8 | [Microsoftの2026コンポーネント一覧](https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/install/includes/vs-2026/workload-component-id-vs-community.md#net-desktop-development) |

- **VS 2015**の行は、リリースノートで同梱が明記された版を示す。旧版を含むTargeting Packの全構成は未確認。4.5.1については、[当時のCommunityセットアップログ](https://stackoverflow.com/questions/37010440/visual-studio-2015-community-setup-failed-installation-error)にMulti-Targeting Packの取得記録がある。
- **VS 2017**の行は、15.8で提供が明記された版を示す。旧版を含む標準構成の全バージョンは、リリースノートからは確認できない。
- **VS 2019**では4.8 SDKが必須項目だが、4.8 Targeting Packはオプション。4.5.1のTargeting Packは推奨項目に含まれる。
- **VS 2022／2026**では4.7.2のTargeting Packが必須、4.8が推奨、4.8.1がオプション。開発PCのWindowsに4.8.1ランタイムが入っていても、4.8.1の参照アセンブリの有無はVisual Studioのインストール構成で決まる。

例えば、VS 2022／2026の標準構成で4.7.2を対象にビルドすれば、.NET Frameworkの条件はWindows 10 IoT Enterprise LTSC 2019の標準搭載版で満たせる。4.8を対象にする場合は、実行先にも4.8以上が必要になる。

## .NET Framework 4.8と4.8.1

4.8.1の主な追加内容は、Windows 11でのArm64ネイティブ対応と、WinForms／WPFのアクセシビリティ改善などです。

| アプリの対象フレームワーク | 実行できるFramework |
|---|---|
| 4.8 | 4.8／4.8.1 |
| 4.8.1 | 4.8.1 |

実行先の判断は[Microsoft Learnの.NET Frameworkバージョン互換性](https://learn.microsoft.com/ja-jp/dotnet/framework/migration-guide/version-compatibility)と[Microsoft Learnの.NET Framework 4.5以降のバージョンと依存関係](https://learn.microsoft.com/ja-jp/dotnet/framework/install/versions-and-dependencies#remarks-for-version-45-and-later)に基づく。

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

確認日：2026-11-18。Windows 11の表は21H2～25H2の範囲です。

- [Microsoft：Windowsと.NET Frameworkの標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server)
- [Microsoft：Windows IoT Enterpriseリリース履歴](https://learn.microsoft.com/ja-jp/windows/iot/iot-enterprise/whats-new/release-history)
- [Microsoft：インストールされた.NET Frameworkの確認方法](https://learn.microsoft.com/ja-jp/dotnet/framework/install/how-to-determine-which-versions-are-installed)
- [Microsoft：.NET Framework 4.8.1の発表](https://devblogs.microsoft.com/dotnet/announcing-dotnet-framework-481/)
