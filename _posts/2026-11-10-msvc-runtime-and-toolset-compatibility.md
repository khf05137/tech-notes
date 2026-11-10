---
layout: post
title: "Visual C++ランタイムとツールセットの対応を確認する"
description: "既存Windows環境を変更せずにC++アプリを配布するため、Redistributableの詳細バージョンとMSVCの互換性、VS2022でv141を使う手順を整理します。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-10 12:00:00 +0900
categories: [Windows]
tags: [C++, MSVC, Visual Studio, ランタイム]
---

## 結論

実行先のWindows環境を変更しない場合は、まずインストール済みVisual C++ランタイムの**詳細バージョンとアーキテクチャ**を確認し、その環境で使えるビルドツールを選ぶ。

「Microsoft Visual C++ 2015-2022 Redistributableが入っている」という製品名だけでは、新しいVS2022でビルドしたアプリをそのまま実行できるとは確定できない。同じ製品名のまま、複数の更新バージョンが存在するためである。

通常のDLL版ランタイムを使うRelease構成（`/MD`）では、実行先に、**ビルドに使用したMSVCに対応するものと同じか、それより新しいRedistributable**が必要になる。

既存のVS2017プロジェクトをVS2022へ移す際は、IDEとビルドツールを分けて考える。VS2022にv141を追加すれば、IDEはVS2022、ビルドツールはVS2017世代という構成にできる。

## 製品名・ツールセット名・詳細バージョンの違い

| 表記 | 意味 |
|---|---|
| Visual Studio 2022 | 開発環境（IDE）の製品名 |
| v141、v142、v143、v145 | C++プロジェクトのプラットフォーム ツールセット名 |
| MSVC 14.16、14.38、14.44など | ビルドツールの具体的な世代 |
| Microsoft Visual C++ 2015-2022 Redistributable | 再頒布可能ランタイムの製品名 |
| 14.38.33135、14.44.35211など | ランタイムの具体的な更新バージョン |
| x86／x64 | 対象のアーキテクチャ |

製品名の「2015-2022」は、対応するVisual Studioの世代を示す。公開年や、詳細バージョンそのものではない。Visual Studio 2022の初版も2021年に公開されている。

例えば、次は同じ製品名の異なる更新版である。

```text
Microsoft Visual C++ 2015-2022 Redistributable — 14.30.xxxxx
Microsoft Visual C++ 2015-2022 Redistributable — 14.38.xxxxx
Microsoft Visual C++ 2015-2022 Redistributable — 14.44.xxxxx
```

「詳細バージョンを調べる」とは、右側の番号を**末尾まで**確認することを指す。

VS2026世代では「Microsoft Visual C++ v14 Redistributable」という表示名が使われる。例えば14.51.36247は14.51世代のランタイムである。

同じアーキテクチャのv14系列では、新しいRedistributableが古いものを置き換える。v141用・v142用・v143用を別製品としてすべて並べて入れる仕組みではない。一方、x86版とx64版は共存でき、VS2013以前のランタイムは別系列である。

## Visual StudioとMSVCの対応

以下は、各Visual Studioに標準で付属するツールセットの対応である。IDEに別世代のツールセットを追加した場合は、そのプロジェクトで実際に選択したものが使われる。

| Visual Studio | ツールセット | MSVCビルドツールの範囲 |
|---|---|---|
| 2015 | v140 | 14.0x |
| 2017 | v141 | 14.10～14.16 |
| 2019 | v142 | 14.20～14.29 |
| 2022 | v143 | 14.30～14.44 |
| 2026 | v145 | 14.50以降 |

**v144はなく、v143の次はv145。** 14.40になってもツールセット名はv143のままである。VS2026以降はMSVCの更新サイクルがIDEから独立しているため、上限は固定しない。

### VS2022の内訳

| VS2022 | MSVC |
|---|---|
| 17.0 | 14.30 |
| 17.1 | 14.31 |
| 17.2 | 14.32 |
| 17.3 | 14.33 |
| 17.4 | 14.34 |
| 17.5 | 14.35 |
| 17.6 | 14.36 |
| 17.7 | 14.37 |
| 17.8 | 14.38 |
| 17.9 | 14.39 |
| 17.10 | 14.40 |
| 17.11 | 14.41 |
| 17.12 | 14.42 |
| 17.13 | 14.43 |
| 17.14 | 14.44 |

この表は世代の対応であり、更新・修正を含む完全なバージョン比較の代わりにはならない。

## バイナリ互換性の方向

VS2015以降のv14系列は、v141とv145を含め、Microsoftのバイナリ互換性の対象である。ただし、**新しいランタイムが古いアプリを動かせること**と、**古いランタイムで新しくビルドしたアプリを動かせること**は別である。

| 組み合わせ | 判断 |
|---|---|
| v141で作ったアプリ ＋ 新しい対応ランタイム | 対応する組み合わせ |
| v145で作ったアプリ ＋ v141当時の古いランタイム | 動作を保証できない。DLLやエントリポイント不足などで起動できない場合がある |
| v143で作ったアプリ ＋「2015-2022」という名前だけ判明しているランタイム | 詳細バージョンが不明なため判断保留 |

Microsoftの条件は、ランタイムをビルドツールと同じか、それより新しくすること。実務上は、**使用するビルドツールに対応するRedistributableを基準に、実行先の詳細バージョンを比較する**。開発PCに入っている最も新しいランタイムが、そのプロジェクトのビルドツールと一致するとは限らない。

### ソースを変更しなければ同じように動くか

同じソースをv141からv143／v145でビルドし直した場合、互換性のある構成なら従来どおり動くことを期待できる。ただし、ソースに書かれたWindows API呼び出しが同じでも、標準ライブラリ・コンパイラの生成コード・最適化まで同一になるわけではない。

バイナリ互換性は再ビルド後の全動作が完全一致する保証ではない。ビルド成功とランタイム条件の確認に加え、実行先で主要機能の動作確認を行う。

既存の静的ライブラリを再利用する場合、`/GL`や`/LTCG`を使ったオブジェクト／ライブラリには別の制約があり、原則として同じビルドツールでの再ビルドが必要になる。

## 実行先ランタイムの確認方法

### 画面から確認

1. コントロールパネル → プログラム → プログラムと機能を開く。
2. 「Microsoft Visual C++」を探す。
3. 製品名、x86／x64、バージョン列の番号を記録する。

例：

```text
Microsoft Visual C++ 2015-2022 Redistributable (x86) - 14.44.35211
Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.44.35211
```

**32bitアプリならx86版、64bitアプリならx64版**が必要。64bit Windowsであっても32bitアプリにはx86版を使う。

### コマンドプロンプトから確認

64bit Windowsでは次を実行する。レジストリの読み取りのみであり、設定は変更しない。

```bat
rem x86版
reg query "HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x86" /v Version /reg:32

rem x64版
reg query "HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" /v Version /reg:64
```

出力例：

```text
Version    REG_SZ    v14.44.35211.0
```

32bit Windowsでは、x86版を次のように確認する。

```bat
reg query "HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x86" /v Version
```

キーが見つからない場合は、その登録を確認できなかったという意味になる。アプリのフォルダにDLLを同梱する配置方式もあるため、登録がないだけで全アプリが実行不能とは判断しない。

## VS2017プロジェクトをVS2022でビルドする場合

### 実行先を変更しない場合の手順

1. 実行先のランタイムの詳細バージョンとx86／x64を調べる。
2. プロジェクトで使っていたツールセットとビルド構成を確認する。
3. 実行先ランタイムで対応できるビルドツールを選ぶ。
4. Release構成でビルドし、実行先で確認する。

| 選択 | 意味・判断 |
|---|---|
| VS2022でv141を使い続ける | IDEだけ移す。従来と同じ世代のビルドツールを使うため、実行環境への影響を抑えやすい |
| VS2022でv143へ変更する | 必要なランタイムも新しくなる可能性がある。詳細バージョンの確認が必要 |
| v145へ変更する | 14.50以降の対応ランタイムが必要。「2015-2022」が入っているという情報だけでは条件を満たすと判断できない |

v141を選ぶ場合も、追加されるのは通常14.16の更新版であり、元のVS2017のビルドツールと完全に同一とは限らない。「v141なら確認不要」とはしない。

### VS2022にv141を追加する方法

1. Visual Studio Installerを開く。
2. Visual Studio 2022の「変更」を選ぶ。
3. 「個別のコンポーネント」タブを開き、`v141`で検索する。
4. 次を選択してインストールする。

```text
MSVC v141 - VS 2017 C++ x64/x86 ビルド ツール (v14.16)
```

コンポーネントID：

```text
Microsoft.VisualStudio.Component.VC.v141.x86.x64
```

VS2017本体は不要。MFC／ATLを使用する場合は、v141用の該当コンポーネントも追加する。

続いてC++プロジェクトのプロパティを開き、次を確認する。

| 項目 | 設定 |
|---|---|
| 構成 | すべての構成、または配布するRelease構成 |
| プラットフォーム | 配布するWin32／x64 |
| 構成プロパティ → 全般 → プラットフォーム ツールセット | Visual Studio 2017 (v141) |
| 構成プロパティ → C/C++ → コード生成 → ランタイム ライブラリ | 既存構成を確認。通常のRelease DLL版は /MD |
| Windows SDKバージョン | 元の指定とインストール状況を確認。ツールセットとは別の設定 |

v143の具体的な版を選ぶ場合は、対応するビルドツールの追加に加え、プロジェクトの「VC++ツール バージョン」などで実際に使用する版を確認する。v143という名前を選ぶだけでは14.30～14.44のどれを使うかは確定しない。

## /MDと/MTの違い

| Release構成 | ランタイムの配置 |
|---|---|
| /MD | DLL版を使う。対応するランタイムの配布が必要 |
| /MT | ランタイムを静的リンクする。そのバイナリ自身のためのRedistributableは不要 |

`/MT`でも、別の依存DLLが`/MD`で作られていれば、そのDLL用のランタイムは必要になる。配布回避のために設定だけ変更する場合も、ライブラリ間の整合性やDLL境界をまたぐメモリ管理を確認する必要がある。

Debug構成の`/MDd`は通常のRedistributableでは満たせないため、開発PCで動いたDebug版をそのまま配布しない。

## Windows Updateによる自動導入について

Microsoft公式資料には、Redistributableで中央配置したC++ライブラリは、Windows Updateで自動更新できると記載されている。

ただし、これは**すべてのWindows PCに必要な最新版が必ず新規インストールされる保証ではない**。実行先の状態は実測する。

2026年1月25日以降に14.44.35211が入ったというAMK情報館の記事については、次の点を区別する。

- 25台中20台で導入されたという、特定環境の報告。
- 対象の26200系ビルドはWindows 11 25H2であり、Win10の導入保証には使えない。
- 記事末尾には、原因はMicrosoft Officeらしいという追記がある。
- 公開記事から導入元を確定するログは確認できず、「Windows Updateが全PCへ配布した」とは断定できない。

14.44.35211自体は、Microsoft公式に掲載されるVS2022 17.14世代のランタイムである。v145用の14.50以降とは区別する。

## 関連情報・出典

公式情報の確認日：2026-11-10。将来のバージョンや配信状況は各資料で再確認する。

- [Microsoft：Visual Studio間のC++バイナリ互換性](https://learn.microsoft.com/ja-jp/cpp/porting/binary-compat-2015-2017)
- [Microsoft：最新のVisual C++ Redistributableと必要条件](https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist)
- [Microsoft：MSVCコンパイラのバージョン管理](https://learn.microsoft.com/ja-jp/cpp/overview/compiler-versions)
- [Microsoft：Visual C++ファイルの再頒布・レジストリによるバージョン確認](https://learn.microsoft.com/en-us/cpp/windows/redistributing-visual-cpp-files)
- [Microsoft：C++アプリの配置方式とWindows Update](https://learn.microsoft.com/en-us/cpp/windows/deployment-in-visual-cpp)
- [Microsoft：VS2022のコンポーネント一覧](https://learn.microsoft.com/en-us/visualstudio/install/workload-component-id-vs-community?view=vs-2022)
- [Microsoft：C++ Build Tools／RedistributableのFAQ](https://learn.microsoft.com/en-us/lifecycle/faq/visual-c-faq)
- [Microsoft：Windows 11リリース情報](https://learn.microsoft.com/ja-jp/windows/release-health/windows11-release-information)
- [AMK情報館：自動インストールに関する体験報告](https://amksystem.com/post/microsoft-visual-c/)

## C++/CLIで.NET Frameworkも使用する場合

VC++ランタイムとは別に、対象.NET Frameworkが実行先にあるか確認します。OS標準搭載版と確認方法は、[Windows 10・11と.NET Frameworkの対応]({{ '/articles/windows-net-framework-versions/' | relative_url }})を参照してください。
