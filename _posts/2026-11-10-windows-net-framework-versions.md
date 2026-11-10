---
layout: post
title: "Windows 10・11と.NET Frameworkの標準搭載バージョン"
description: "Windows 10・11、IoT Enterpriseの標準.NET Framework対応表と、OS情報からの判断、Release値による確認、4.8と4.8.1の使い分けを整理します。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-10 12:00:00 +0900
categories: [Windows]
tags: [.NET Framework, Windows 10, Windows 11, IoT, C++/CLI]
---

## 結論

Windowsの**エディション・バージョン・OSビルド**が分かれば、標準搭載される.NET Frameworkの最低ラインを判断できる。後から更新されている場合があるため、実際にインストールされている版の特定にはレジストリの `Release` 値を使う。

- Windows 10は世代により.NET Framework 4.6～4.8。
- Windows 11の初期版（21H2）は4.8、22H2～25H2は4.8.1。
- 装置向けのWindows IoT Enterpriseも、ベースOSのバージョンに対応付けて判断する。
- C++/CLIでは.NET FrameworkとVC++ランタイムの条件をそれぞれ確認する。

対象は.NET Framework 4.x。現行.NET（.NET 8など）や別製品のWindows 10 IoT Coreとは区別する。

## Windows 10の標準搭載バージョン

| Windows 10 | 標準搭載.NET Framework |
|---|---|
| 1507 | 4.6 |
| 1511 | 4.6.1 |
| 1607 | 4.6.2 |
| 1703 | 4.7 |
| 1709 | 4.7.1 |
| 1803 | 4.7.2 |
| 1809 | 4.7.2 |
| 1903／1909 | 4.8 |
| 2004／20H2 | 4.8 |
| 21H1／21H2／22H2 | 4.8 |

例として、1809なら標準搭載は4.7.2、1903以降なら4.8と判断できる。「Win10」としか分からない段階では4.8があるとは断定できない。

この表は出荷時の標準搭載版であり、現在の導入状態やOS・Frameworkのサポート期間を示す表ではない。手動インストール以外にも、更新や装置メーカーの初期構成で新しい版が入っている場合がある。

## 装置向けWindows 10 IoT Enterprise

| 製品 | ベースのWin10 | OSビルドの先頭 | 標準搭載.NET Framework |
|---|---|---|---|
| IoT Enterprise LTSB 2015 | 1507 | 10240 | 4.6 |
| IoT Enterprise LTSB 2016 | 1607 | 14393 | 4.6.2 |
| IoT Enterprise LTSC 2019 | 1809 | 17763 | 4.7.2 |
| IoT Enterprise LTSC 2021 | 21H2 | 19044 | 4.8 |

MicrosoftのIoT Enterpriseリリース履歴と.NET Framework標準搭載表を対応付けたもの。OSビルドは通常 `17763.xxxx` のように更新番号が続く。

例えば「Windows 10 IoT Enterprise LTSC 2019」という情報が得られれば、OS標準として.NET Framework 4.7.2を想定できる。4.8へ更新済みかどうかは別途確認する。

この表は通常のWindowsデスクトップアプリを動かすIoT Enterprise向けであり、IoT Coreの対応表としては使用しない。

## Windows 11の標準搭載バージョン

| Windows 11 | 標準搭載.NET Framework |
|---|---|
| 21H2（初期版） | 4.8 |
| 22H2 | 4.8.1 |
| 23H2 | 4.8.1 |
| 24H2 | 4.8.1 |
| 25H2 | 4.8.1 |

Windows 11 IoT EnterpriseでもベースOSに対応付けて判断できる。例えばIoT Enterprise LTSC 2024は24H2をベースとするため4.8.1世代となる。

Windows 11 21H2も後から4.8.1に更新できる。このため、21H2という情報だけでは4.8と4.8.1のどちらが実際に入っているかまでは確定しない。

上表は確認した21H2～25H2の範囲を示す。新しいリリースは公式資料で確認する。

## 4.8を対象にするか、4.8.1を対象にするか

4.8.1の主な追加内容は、Windows 11上でのArm64ネイティブ対応と、WinForms／WPFのアクセシビリティ改善など。ARM専用の更新ではない。

既存のx86／x64アプリで4.8.1固有の機能・動作を必要としなければ、**対象フレームワークを4.8に保つ**方針でよい。4.8対象のアプリは、4.8.1環境でも動作する設計である。

| 対象フレームワーク | 実行先 |
|---|---|
| .NET Framework 4.8 | 4.8または4.8.1の環境 |
| .NET Framework 4.8.1 | 4.8.1の環境。4.8しかない環境は対象外 |

.NET Framework 4.xはインプレース更新であり、4.8と4.8.1を別々の実行環境として並べてインストールする仕組みではない。

「4.8で打ち止めと公式に保証されていた」「4.8.1はARMのためだけに出た」とは扱わない。4.8.1を必須にするかは、アプリの要件と配布先で判断する。互換性は全機能の動作保証とは別なので、配布先で動作確認を行う。

## 実行先に問い合わせる内容

実機を直接調査できない場合は、まず次の情報を依頼する。

> ［設定］→［システム］→［詳細情報］の「Windowsの仕様」に表示される、以下の情報を教えてください。該当部分のスクリーンショットでも構いません。
>
> - エディション
> - バージョン
> - OSビルド

Windowsの表示によっては「詳細情報」が「バージョン情報」になっている場合がある。`winver` の画面も補助情報になる。

この3項目から標準搭載の最低ラインを判断する。必要な対象フレームワークを標準で満たしていれば、追加調査を減らせる。例えば、Win10 21H2なら4.8を標準で満たすが、Win10 1809で4.8が必要なら、更新済みかどうかを調べる。

C++/CLIアプリの場合、別途VC++ Redistributableのx86／x64と詳細バージョンも問い合わせる。.NET Frameworkの確認だけではネイティブ側の条件は分からない。

## 実際にインストールされた版を確認する

### コマンドプロンプト

管理者権限での変更操作やPowerShellは不要。通常のコマンドプロンプトで、次の読み取りコマンドを実行する。

```bat
reg query "HKLM\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release
```

64bit Windowsでレジストリビューを明示したい場合：

```bat
reg query "HKLM\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release /reg:64
```

`Release` はREG_DWORDで、`reg query` では通常16進数で表示される。結果をそのまま送ってもらえば、公式の対応表で判定できる。

### レジストリエディター

1. `regedit` を開く。
2. 次のキーを開く。

```text
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full
```

3. `Release` を確認する。
4. 10進数を見たい場合は値を開いて「10進数」を選択し、値は変更せずキャンセルで閉じる。

### Release値の読み方

以下は「そのバージョン以上があるか」を判定する最小値。OSにより同じFramework版でもRelease値が異なるため、完全一致だけで判定しない。

| .NET Framework以上 | Release最小値（10進数） |
|---|---|
| 4.6 | 393295 |
| 4.6.1 | 394254 |
| 4.6.2 | 394802 |
| 4.7 | 460798 |
| 4.7.1 | 461308 |
| 4.7.2 | 461808 |
| 4.8 | 528040 |
| 4.8.1 | 533320 |

例えば、Releaseが528040以上なら4.8以上、533320以上なら4.8.1以上を満たす。版名を分類する場合は**新しい版のしきい値から順に比較する**。

`v4.0.30319` というフォルダ名やCLRバージョンだけでは、4.7.2／4.8／4.8.1を区別できない。`dotnet --info` も現行.NET向けの情報であり、この確認の代わりにはしない。

## C++/CLIプロジェクトとの関係

.NET Frameworkを対象とするC++/CLIでは、次を別々に確認する。

| 確認対象 | 判断する情報 |
|---|---|
| マネージド側 | 対象.NET Frameworkと実行先の導入版 |
| ネイティブ側 | MSVCツールセット、VC++ランタイム、x86／x64 |
| OS | API・依存ライブラリが対応するWindowsのバージョン |

IDEをVS2022へ移すこと、MSVCをv141からv143へ変えること、対象.NET Frameworkを4.8へ変えることは、それぞれ別の変更である。IDEを新しくしたからといって、対象Frameworkを自動的に新しくする必要はない。

開発PCでは、対象Frameworkに対応するDeveloper Pack／Targeting Packも必要になる。実行用ランタイムの有無と開発用参照アセンブリの有無は区別する。

VC++ランタイムとツールセットについては、[Visual C++ランタイムとMSVCツールセットの対応]({{ '/articles/msvc-runtime-and-toolset-compatibility/' | relative_url }})を参照。

## 参考資料

確認日：2026-11-10。OSの標準搭載情報、現在の導入状態、サポート期間は区別して扱う。

- [Microsoft：Windowsに.NET Frameworkをインストールする／OS標準搭載表](https://learn.microsoft.com/ja-jp/dotnet/framework/install/on-windows-and-server)
- [Microsoft：インストールされた.NET Frameworkの確認・Release値](https://learn.microsoft.com/ja-jp/dotnet/framework/install/how-to-determine-which-versions-are-installed)
- [Microsoft：.NET FrameworkとOSの依存関係](https://learn.microsoft.com/ja-jp/dotnet/framework/install/versions-and-dependencies)
- [Microsoft：Windows IoT Enterpriseリリース履歴](https://learn.microsoft.com/ja-jp/windows/iot/iot-enterprise/whats-new/release-history)
- [Microsoft：.NET Framework 4.8.1の発表](https://devblogs.microsoft.com/dotnet/announcing-dotnet-framework-481/)
- [Microsoft：開発者向け.NET Frameworkのインストール](https://learn.microsoft.com/ja-jp/dotnet/framework/install/guide-for-developers)
