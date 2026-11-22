---
layout: post
title: "Visual C++ランタイムとMSVCツールセットのバージョン対応"
description: "Visual Studio、MSVCツールセット、Visual C++ Redistributableのバージョン対応と、ランタイムの互換性を表で整理します。"
date: 2026-11-10 12:00:00 +0900
updated: 2026-11-22 00:00:00 +0900
categories: [Windows]
tags: [C++, MSVC, Visual Studio, ランタイム]
---

Visual C++のバージョンには、Visual Studioの製品名、`v143`のようなツールセット名、`14.44.35211`のようなランタイムの番号があります。それぞれの対応をまとめます。

## Visual Studio・ツールセット・ランタイムの対応

| Visual Studio | ツールセット | MSVCビルドツール | 対応するランタイムの世代 |
|---|---|---|---|
| 2015 | v140 | 14.0x | 14.0 |
| 2017 | v141 | 14.10～14.16 | 14.1x系 |
| 2019 | v142 | 14.20～14.29 | 14.2x系 |
| 2022 | v143 | 14.30～14.44 | 14.3x～14.4x系 |
| 2026 | v145 | 14.50以降 | 14.5x系以降 |

表のランタイム欄は、各ツールに対応する世代を示します。新しいランタイムは以前の世代のアプリにも対応するため、例えばv141のアプリに14.44系のランタイムを使うこともできます。

**v144はなく、v143の次がv145です。** MSVCが14.40になってもツールセット名はv143のままです。VS2026以降は、MSVCのバージョン更新がVisual Studio本体から独立しています。

また、IDEに別世代のツールセットを追加することもできます。実際のビルドに使われるのは、プロジェクトで選択したツールセットです。

### VS2017の内訳

各15.xで標準のMSVCビルドツールを示します。ツールセット名はすべて`v141`です。

| VS2017 | MSVCビルドツール | コンパイラ（`cl.exe`） | `_MSC_VER` |
|---|---|---|---|
| 15.0（初期版） | 14.10 | `19.10.xxxxx` | `1910` |
| 15.1 | 14.10 | `19.10.xxxxx` | `1910` |
| 15.2 | 14.10 | `19.10.xxxxx` | `1910` |
| 15.3 | 14.11 | `19.11.xxxxx` | `1911` |
| 15.4 | 14.11 | `19.11.xxxxx` | `1911` |
| 15.5 | 14.12 | `19.12.xxxxx` | `1912` |
| 15.6 | 14.13 | `19.13.xxxxx` | `1913` |
| 15.7 | 14.14 | `19.14.xxxxx` | `1914` |
| 15.8 | 14.15 | `19.15.xxxxx` | `1915` |
| 15.9 | 14.16 | `19.16.xxxxx` | `1916` |

15.1と15.2では14.10、15.4では14.11が引き続き使われました。

[Microsoft LearnのMSVCコンパイラのバージョン管理](https://learn.microsoft.com/ja-jp/cpp/overview/compiler-versions)・[Microsoft C++チームブログのVS2017ツールセット対応表（15.1／15.2／15.4を含む）](https://devblogs.microsoft.com/cppblog/side-by-side-minor-version-msvc-toolsets-in-visual-studio-2017/)

### VS2022の内訳

各17.xで標準のMSVCビルドツールを示します。ツールセット名はすべて`v143`です。

| VS2022 | MSVCビルドツール | コンパイラ（`cl.exe`） | `_MSC_VER` |
|---|---|---|---|
| 17.0（初期版） | 14.30 | `19.30.xxxxx` | `1930` |
| 17.1 | 14.31 | `19.31.xxxxx` | `1931` |
| 17.2 | 14.32 | `19.32.xxxxx` | `1932` |
| 17.3 | 14.33 | `19.33.xxxxx` | `1933` |
| 17.4 | 14.34 | `19.34.xxxxx` | `1934` |
| 17.5 | 14.35 | `19.35.xxxxx` | `1935` |
| 17.6 | 14.36 | `19.36.xxxxx` | `1936` |
| 17.7 | 14.37 | `19.37.xxxxx` | `1937` |
| 17.8 | 14.38 | `19.38.xxxxx` | `1938` |
| 17.9 | 14.39 | `19.39.xxxxx` | `1939` |
| 17.10 | 14.40 | `19.40.xxxxx` | `1940` |
| 17.11 | 14.41 | `19.41.xxxxx` | `1941` |
| 17.12 | 14.42 | `19.42.xxxxx` | `1942` |
| 17.13 | 14.43 | `19.43.xxxxx` | `1943` |
| 17.14 | 14.44 | `19.44.xxxxx` | `1944` |

17.10でMSVCは14.40、`_MSC_VER`は`1940`になりました。コンパイラの末尾のビルド番号は更新で変わることがあり、詳細は`cl /Bv`で確認できます。

[Microsoft LearnのMSVCコンパイラのバージョン管理](https://learn.microsoft.com/ja-jp/cpp/overview/compiler-versions)・[Microsoft C++チームブログの17.10でのバージョン変更](https://devblogs.microsoft.com/cppblog/msvc-toolset-minor-version-number-14-40-in-vs-2022-v17-10/)

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
