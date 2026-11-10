---
layout: post
title: "Visual C++ランタイムとMSVCツールセットのバージョン対応"
description: "Visual Studio、MSVCツールセット、Visual C++ Redistributableのバージョン対応と、ランタイムの互換性を表で整理します。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-10 22:00:00 +0900
categories: [Windows]
tags: [C++, MSVC, Visual Studio, ランタイム]
---

Visual C++のバージョンには、Visual Studioの製品名、`v143`のようなツールセット名、`14.44.35211`のようなランタイムの番号があります。それぞれの対応をまとめます。

## Visual Studio・ツールセット・ランタイムの対応

| Visual Studio | ツールセット | MSVCビルドツール | 対応するランタイムの世代 |
|---|---|---|---|
| 2015 | v140 | 14.0x | 14.0系 |
| 2017 | v141 | 14.10～14.16 | 14.1x系 |
| 2019 | v142 | 14.20～14.29 | 14.2x系 |
| 2022 | v143 | 14.30～14.44 | 14.3x～14.4x系 |
| 2026 | v145 | 14.50以降 | 14.5x系以降 |

表のランタイム欄は、各ツールに対応する世代を示します。新しいランタイムは以前の世代のアプリにも対応するため、例えばv141のアプリに14.44系のランタイムを使うこともできます。

**v144はなく、v143の次がv145です。** MSVCが14.40になってもツールセット名はv143のままです。VS2026以降は、MSVCのバージョン更新がVisual Studio本体から独立しています。

また、IDEに別世代のツールセットを追加することもできます。実際のビルドに使われるのは、プロジェクトで選択したツールセットです。

### VS2022の内訳

| Visual Studio 2022 | MSVC |
|---|---|
| 17.0～17.9 | 14.30～14.39（順に対応） |
| 17.10 | 14.40 |
| 17.11 | 14.41 |
| 17.12 | 14.42 |
| 17.13 | 14.43 |
| 17.14 | 14.44 |

## 「2015–2022」という製品名と詳細バージョン

`Microsoft Visual C++ 2015-2022 Redistributable`は製品名です。「2022」はVisual Studioの世代を示し、公開年や具体的な更新番号ではありません。

同じ製品名でも、次のように更新バージョンが異なります。

```text
Microsoft Visual C++ 2015-2022 Redistributable — 14.30.xxxxx
Microsoft Visual C++ 2015-2022 Redistributable — 14.38.xxxxx
Microsoft Visual C++ 2015-2022 Redistributable — 14.44.xxxxx
```

互換性を確認するときは、製品名に加えて、**14.44.35211のような末尾までの番号**を確認します。VS2026世代では、`Microsoft Visual C++ v14 Redistributable`という表示名が使われています。

## ランタイムの互換性

通常のDLL版ランタイムを使うRelease構成（`/MD`）では、**ビルドに使用したMSVCに対応するRedistributableと同じか、それより新しいもの**が必要です。

| アプリとランタイム | 対応 |
|---|---|
| 古いMSVCでビルドしたアプリ ＋ 新しい対応ランタイム | 対応 |
| 新しいMSVCでビルドしたアプリ ＋ 古いランタイム | 動作は保証されない |

v14系列は、新しいランタイムが古いものを置き換える仕組みです。同じアーキテクチャについて、v141用・v142用・v143用を別々に入れる必要はありません。

ただし、**v143という名前だけでは詳細な対応は決まりません。** 14.30～14.44のどれを使ったかに加え、修正版の番号も確認します。VS2013以前のランタイムは別系列です。

## x86／x64とバージョンの確認

| アプリ | 必要なランタイム |
|---|---|
| 32bit（Win32） | x86版 |
| 64bit（x64） | x64版 |

64bit Windows上の32bitアプリにも、x86版が必要です。x86版とx64版は共存できます。

インストール済みの番号は、**コントロールパネル → プログラムと機能**で「Microsoft Visual C++」を探すと確認できます。

なお、ランタイムを静的リンクする`/MT`構成では、そのバイナリ自身のためのRedistributableは不要です。依存DLLが必要とするランタイムは別に確認します。

C++/CLIで使う.NET Frameworkについては、[Windows 10・11と.NET Frameworkの対応表]({{ '/articles/windows-net-framework-versions/' | relative_url }})も参照してください。

## 参考資料

確認日：2026-11-10。

- [Microsoft：MSVCコンパイラのバージョン管理](https://learn.microsoft.com/ja-jp/cpp/overview/compiler-versions)
- [Microsoft：Visual Studio間のC++バイナリ互換性](https://learn.microsoft.com/ja-jp/cpp/porting/binary-compat-2015-2017)
- [Microsoft：Visual C++ Redistributableのダウンロードと必要条件](https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist)
- [Microsoft：C++アプリの配置方式](https://learn.microsoft.com/en-us/cpp/windows/deployment-in-visual-cpp)
