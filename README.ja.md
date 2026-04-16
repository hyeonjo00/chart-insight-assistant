# Chart Insight Assistant

Chart Insight Assistant は、チャート画像をアップロードし、OpenAI によるシナリオベースの分析結果を表示し、完了した分析をブラウザのローカル履歴に保存できるポートフォリオ向け Next.js アプリです。単なるデモではなく、アップロード、サーバー API、結果カード、履歴、AdSense 対応までを含む拡張しやすいプロダクト基盤として作られています。

[English](./README.en.md) | [한국어](./README.ko.md) | [Language Hub](./README.md)

## スクリーンショット

| Home | Analyze | Analysis Result | History |
| --- | --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![Analysis Result](./public/readme/analysis-result.png) | ![History](./public/readme/history.png) |

## 概要

このアプリでは、ユーザーがチャート画像をアップロードすると、サーバールートが画像を OpenAI に送信し、決められた JSON 形式の結果を受け取って UI に表示します。結果は自由な文章ではなく、Bias、Confidence、Entry Zone、Invalidation Zone、Take Profit Targets、Summary に分けて表示されます。

分析は常に慎重なシナリオベースの解釈を前提にしています。将来の値動きを保証せず、結果 UI には投資助言ではないことを示す免責文も含まれています。

## 主な機能

- ダークテーマのレスポンシブ UI
- Next.js App Router による Home、Analyze、History ページ
- ドラッグアンドドロップ画像アップロード
- クリックによる画像ファイル選択
- アップロード画像プレビュー
- PNG、JPG、JPEG、WEBP のファイル検証
- クライアントとサーバー両方での基本検証
- `/api/analyze` サーバールートによる OpenAI 画像分析
- 構造化 JSON レスポンス
- Bias と Confidence を強調する結果カード
- ブラウザ `localStorage` ベースの分析履歴
- 履歴アイテムの個別削除
- Google AdSense 対応の広告バナーコンポーネント
- グローバル AdSense スクリプトと `ads.txt`

## 分析フロー

1. ユーザーが Analyze ページでチャート画像をアップロードします。
2. フロントエンドが画像形式とファイルサイズを検証します。
3. アップロード領域に画像プレビューが表示されます。
4. ユーザーが `Analyze Chart` をクリックします。
5. フロントエンドが画像を `/api/analyze` に送信します。
6. サーバーが画像形式とサイズを再度検証します。
7. サーバーが慎重なシナリオベースのプロンプトとともに画像を OpenAI に送信します。
8. OpenAI が構造化 JSON を返します。
9. アプリが結果カードを表示し、ローカル履歴に保存します。

## 分析結果の形式

```json
{
  "bias": "long | short | neutral",
  "entry_zone": "string",
  "invalidation_zone": "string",
  "take_profit": ["string"],
  "confidence": "low | medium | high",
  "summary": "string"
}
```

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| フレームワーク | Next.js App Router |
| 言語 | TypeScript |
| UI | React |
| スタイリング | Tailwind CSS |
| AI | OpenAI Responses API |
| 保存 | ブラウザ `localStorage` |
| 広告 | Google AdSense 対応 |

## プロジェクト構成

```text
app/
  api/analyze/route.ts      OpenAI チャート分析 API ルート
  analyze/page.tsx          分析ページ
  history/page.tsx          ローカル履歴ページ
  layout.tsx                ルートレイアウトとグローバル AdSense スクリプト
  page.tsx                  ホームページ
components/
  ad-banner.tsx             再利用可能な AdSense 対応広告スロット
  chart-upload-panel.tsx    アップロード、プレビュー、分析リクエスト、結果表示
  layout/site-header.tsx    トップナビゲーション
  ui/                       再利用 UI コンポーネント
lib/
  analysis-history.ts       localStorage 履歴ヘルパー
  utils.ts                  共通ユーティリティ
public/
  ads.txt                   AdSense 確認ファイル
  readme/                   README スクリーンショット
```

## はじめ方

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. プロジェクトルートに `.env.local` を作成します。

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484
   ```

3. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

4. [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 必須 | `/api/analyze` サーバールートで OpenAI 呼び出しに使用 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 任意 | 実際の AdSense スロットを使う場合の公開クライアント ID |

## 利用できるスクリプト

| スクリプト | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルドを作成 |
| `npm run start` | 本番サーバーを起動 |
| `npm run lint` | lint を実行 |
| `npm run type-check` | TypeScript の型チェックを実行 |

## Vercel デプロイ

1. リポジトリを GitHub に push します。
2. Vercel でプロジェクトを Import します。
3. Vercel の環境変数に `OPENAI_API_KEY` を追加します。
4. 実際の広告スロットを使う場合は `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484` も追加します。
5. デプロイします。

## セキュリティメモ

- OpenAI API キーはブラウザに公開されません。
- API キーはサーバー側で `process.env.OPENAI_API_KEY` から読み取ります。
- アップロード画像はクライアントとサーバーの両方で基本検証されます。
- `.env.local` はリポジトリにコミットしないでください。
- 実際のキーを一度でもコミットした場合は、デプロイ前に必ずローテーションしてください。

## AdSense メモ

- `app/layout.tsx` でグローバル AdSense スクリプトを読み込みます。
- `components/ad-banner.tsx` が再利用可能な広告スロットを表示します。
- `public/ads.txt` は AdSense サイト確認用に含まれています。
- 実際に広告を表示するには Google AdSense で発行された `adSlot` 値が必要です。

## ロードマップ

- ユーザー認証の追加
- 分析履歴のデータベース保存
- シンボル、取引所、時間足などのチャートメタデータ追加
- ユーザー分析プリセットの保存
- 分析 API の rate limit 追加
- 本番ログとモニタリング追加

## 免責事項

このプロジェクトは学習およびポートフォリオ目的です。AI によるチャート分析はシナリオベースの参考情報であり、投資助言ではありません。
