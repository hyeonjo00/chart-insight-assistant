# Chart Insight Assistant

Chart Insight Assistant は、チャート画像のアップロード、OpenAI を使ったシナリオベース分析、ローカル履歴の確認をダークテーマ UI で提供する、ポートフォリオ向けの Next.js アプリです。

[English](./README.en.md) | [한국어](./README.ko.md) | [Language Hub](./README.md)

## スクリーンショット

| Home | Analyze | Analysis Result | History |
| --- | --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![Analysis Result](./public/readme/analysis-result.png) | ![History](./public/readme/history.png) |

## 主な機能

- Next.js App Router、TypeScript、Tailwind CSS 構成
- ダークテーマ中心のレスポンシブ UI
- ドラッグアンドドロップ対応の画像アップロード、プレビュー、ファイル検証
- チャート画像向け OpenAI 分析 API ルート
- Bias、Confidence、Zone、Targets、Summary を表示する結果カード
- ブラウザ `localStorage` ベースの分析履歴
- Google AdSense 用のグローバルスクリプト、広告バナーコンポーネント、`ads.txt` を用意

## 技術スタック

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API

## プロジェクト構成

```text
app/
  api/analyze/route.ts
  analyze/page.tsx
  history/page.tsx
  layout.tsx
  page.tsx
components/
  ad-banner.tsx
  chart-upload-panel.tsx
  layout/site-header.tsx
  ui/...
lib/
  analysis-history.ts
  utils.ts
public/
  ads.txt
  readme/
```

## はじめ方

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. `.env.local` を作成します。

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

- `OPENAI_API_KEY`
  `/api/analyze` のサーバールートで使用します。
- `NEXT_PUBLIC_ADSENSE_CLIENT`
  再利用可能な広告バナーコンポーネントで実際の AdSense スロットを使う場合に使用します。

## 利用できるスクリプト

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`

## Vercel デプロイ

1. リポジトリを GitHub に push します。
2. Vercel でプロジェクトを Import します。
3. `OPENAI_API_KEY` を Vercel の環境変数に追加します。
4. 実際の広告スロットを使う場合は `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484` も追加します。
5. デプロイします。

## メモ

- 分析結果はシナリオベースであり、投資助言ではありません。
- 履歴はブラウザ `localStorage` に保存されます。
- AdSense 確認用の `public/ads.txt` を含んでいます。
