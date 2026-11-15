---
layout: post
title: "Linuxのバージョン・CPU・ライブラリ情報を調べるコマンド"
description: "ディストリビューションとカーネルの版から、実行ファイルやライブラリのCPU、コンパイラ、依存関係まで、確認コマンドと出力の読み方を整理します。"
date: 2026-11-15 00:00:00 +0900
updated: 2026-11-15 00:00:00 +0900
categories: [Linux]
tags: [Linux, C++, GCC, ELF, ライブラリ, バージョン確認]
---

Linuxの環境調査では、**現在動いているOSの情報**と、**調べたい実行ファイル・ライブラリに記録された情報**を分けて確認します。

例えば、今のPCに入っているGCCのバージョンを調べても、受け取ったライブラリがどのGCCで作られたかは分かりません。この記事では、目的に応じたコマンドと、そこから分かること・分からないことをまとめます。

## 対象と準備

Linux上のネイティブ実行ファイル、共有ライブラリ（.so）、静的ライブラリ（.a）を対象とします。readelfとarはGNU Binutilsのものを想定しています。出力例は説明用で、特定製品の互換性を検証した結果ではありません。

コマンドが見つからない場合は、利用しているディストリビューションのfile／binutilsパッケージを確認してください。以下の情報取得コマンド自体は、通常、管理者権限を必要としません。

## まず使うコマンド一覧

| 調べたい情報 | コマンド |
|---|---|
| ディストリビューション名とバージョン | `cat /etc/os-release` |
| 実行中のカーネル | `uname -r` |
| カーネルが示すCPUアーキテクチャ | `uname -m` |
| 現在の環境のGCC／G++ | `gcc --version` / `g++ --version` |
| ファイルの種類・CPU・32/64bit | `file libExample.so` |
| ELFヘッダーの詳細 | `readelf -h libExample.so` |
| 作成コンパイラの手掛かり | `readelf -p .comment libExample.so` |
| 直接依存する共有ライブラリ | `readelf -d libExample.so` |
| 要求するシンボルバージョン | `readelf --version-info libExample.so` |
| 静的ライブラリ内のファイル一覧 | `ar t libExample.a` |

libExample.so／libExample.aは対象ファイルのパスに置き換えます。ELF形式の実行ファイルにも、同様にfileやreadelfを使用できます。

## OS・カーネル・実行環境の確認

| 確認項目 | コマンド | 読み方 |
|---|---|---|
| ディストリビューション名・版 | `cat /etc/os-release` | 表示用はPRETTY_NAME、機械判定はIDとVERSION_ID |
| 実行中のカーネルの版 | `uname -r` | インストール済みの別カーネルではなく、現在動いているもの |
| カーネルなどの情報一式 | `uname -a` | ホスト名やアーキテクチャなども表示 |
| カーネルが示すマシンアーキテクチャ | `uname -m` | x86_64、aarch64など |

```bash
cat /etc/os-release
uname -r
uname -m
```

`/etc/os-release` の出力例：

```ini
PRETTY_NAME="Ubuntu 20.04.6 LTS"
NAME="Ubuntu"
ID=ubuntu
VERSION_ID="20.04"
```

ディストリビューションはOS製品全体、カーネルは中核部分であり、版番号は別体系。
コンテナ内のOS情報はコンテナのユーザー空間を表し、カーネルは通常ホストと共有する。
また、`uname -m`だけでは個々のアプリやライブラリが32bitか64bitかは分からない。

## 実行ファイル・共有ライブラリのCPUと32/64bit

以下のlibExample.so／libExample.aは調査対象のファイル名に置き換える。

```bash
file libExample.so
readelf -h libExample.so
```

`file` の出力例：

```text
libExample.so: ELF 64-bit LSB shared object, x86-64, ...
```

| 表示・項目 | 意味 |
|---|---|
| ELF32 / ELF64、Class | オブジェクトの32bit／64bit形式 |
| x86-64 / Machine | 対象CPUアーキテクチャ |
| ARM / AArch64 | ARM系／ARM 64bit。詳細条件は追加確認 |
| LSB / MSB、Data | バイト順序（リトル／ビッグエンディアン） |

同一プロセスに読み込む実行ファイルと共有ライブラリは、CPUアーキテクチャや32/64bitなどを合わせる必要がある。

ただし、x86-64という表示だけで、必要なAVX2等の命令セットまで確定できるわけではない。
`readelf -n` にGNU property等の手掛かりが出る場合もあるが、記録がないことは追加命令を使っていない証明にはならない。
正確な要件は提供元のビルド条件と実機検証で確認する。

## バイナリを作成したコンパイラの手掛かり

```bash
readelf -p .comment libExample.so
```

出力例：

```text
GCC: (GNU) 4.8.5 ...
```

- .commentが残っていれば、GCCやClangなどの情報が見つかる場合がある。
- 複数のオブジェクトをリンクした結果、複数の版が表示されることもある。
- セクションが削除されていれば取得できない。
- .commentだけでは、全ソースのコンパイラ、リンカー、C++規格、最適化、CPU命令の設定を確定できない。
- `gcc --version`や`g++ --version`は現在の環境のコンパイラを表示するもので、既存バイナリの作成環境ではない。

デバッグ情報が残っていれば、次のDW_AT_producerも追加の手掛かりになる。出力は大きくなる場合がある。

```bash
readelf --debug-dump=info libExample.so | grep DW_AT_producer
```

## 依存ライブラリと要求バージョン

### 直接依存する共有ライブラリ

```bash
readelf -d libExample.so | grep NEEDED
```

libc.so.6、libstdc++.so.6、専用ライブラリなどの依存名を確認する。
ここで分かるのは直接の依存名であり、実際の解決先や依存先のさらに先までは分からない。
また、実行時にdlopenなどで読み込むライブラリはNEEDEDに出ない場合がある。

ライブラリの探索設定も調べられる。

```bash
readelf -d libExample.so | grep -E 'NEEDED|RPATH|RUNPATH'
```

### 要求するシンボルバージョン

```bash
readelf --version-info libExample.so
```

| 接頭辞 | 主に関係するもの |
|---|---|
| GLIBC_ | glibc |
| GLIBCXX_ | GCCのC++標準ライブラリlibstdc++ |
| CXXABI_ | C++ ABIに関係するランタイム |

出力には定義側と要求側の情報が含まれる場合があるため、特に「Version needs」側を見る。
これらはコンパイラ自体のバージョンではなく、実行時に必要なシンボルのバージョン。
要求を満たすだけで、専用ライブラリを含む全体の動作が保証されるわけではない。

### C++ ABIの注意

専用ライブラリの公開インターフェースがC++クラスやstd::string／std::listなどを含む場合、双方のABIを合わせる必要がある。
GCC 5.1ではstd::stringとstd::listの新しいABIが導入され、旧ABIとの切替には `_GLIBCXX_USE_CXX11_ABI` が関係する。
`-std=c++11`などの言語規格指定とは別の設定である。

C形式のインターフェースはC++固有のABI依存を減らせるが、構造体のレイアウト、型サイズ、メモリの確保・解放規約などは別途一致が必要。
提供元の推奨コンパイラとビルド設定を優先し、互換性設定を推測だけで変更しない。

## 静的ライブラリ.aの情報

```bash
file libExample.a
ar t libExample.a
readelf -h libExample.a
readelf -p .comment libExample.a
```

.aは通常オブジェクトファイルのアーカイブ。`file`だけではアーカイブとしか表示されないことがある。
GNU readelfは内部のELFオブジェクトも調べられるため、メンバーごとのCPUや.commentを確認する。

静的ライブラリ単体には、最終的な共有ライブラリの依存情報・要求バージョンが揃っていない場合がある。
最終リンク後の実行ファイルや.soも調べる。
LTOオブジェクトなどでは、さらに対応するコンパイラ／プラグインの条件が関係する場合がある。

## 参考資料

- [os-release — systemd公式](https://www.freedesktop.org/software/systemd/man/latest/os-release.html)
- [uname — GNU Coreutils公式](https://www.gnu.org/software/coreutils/manual/html_node/uname-invocation.html)
- [readelf — GNU Binutils公式](https://sourceware.org/binutils/docs/binutils/readelf.html)
- [ar — GNU Binutils公式](https://sourceware.org/binutils/docs/binutils/ar.html)
- [ABI Policy and Guidelines — GCC公式](https://gcc.gnu.org/onlinedocs/libstdc++/manual/abi.html)
- [Dual ABI — GCC公式](https://gcc.gnu.org/onlinedocs/libstdc++/manual/using_dual_abi.html)
