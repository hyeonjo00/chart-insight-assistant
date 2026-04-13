# Chart Insight Assistant

Chart Insight Assistant는 차트 스크린샷 업로드, OpenAI 기반 시나리오형 분석, 로컬 히스토리 확인 기능을 다크 테마 UI로 제공하는 포트폴리오용 Next.js 앱입니다.

[English](./README.en.md) | [日本語](./README.ja.md) | [언어 선택 허브](./README.md)

## 스크린샷

| 홈 | 분석 | 히스토리 |
| --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![History](./public/readme/history.png) |

## 주요 기능

- Next.js App Router, TypeScript, Tailwind CSS 기반 구성
- 다크 테마 중심의 반응형 UI
- 드래그 앤 드롭 이미지 업로드, 미리보기, 파일 검증
- 차트 스크린샷용 OpenAI 분석 API 라우트
- Bias, Confidence, Zone, Targets, Summary를 보여주는 결과 카드
- 브라우저 `localStorage` 기반 분석 히스토리
- Google AdSense용 전역 스크립트, 광고 배너 컴포넌트, `ads.txt` 준비 완료

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API

## 프로젝트 구조

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

## 시작 방법

1. 의존성을 설치합니다.

   ```bash
   npm install
   ```

2. `.env.local` 파일을 만듭니다.

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484
   ```

3. 개발 서버를 실행합니다.

   ```bash
   npm run dev
   ```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경 변수

- `OPENAI_API_KEY`
  `/api/analyze` 서버 라우트에서 사용합니다.
- `NEXT_PUBLIC_ADSENSE_CLIENT`
  재사용 가능한 광고 배너 컴포넌트에서 실제 AdSense 슬롯을 사용할 때 사용합니다.

## 사용 가능한 스크립트

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`

## Vercel 배포

1. 저장소를 GitHub에 푸시합니다.
2. Vercel에서 프로젝트를 Import 합니다.
3. Vercel 환경 변수에 `OPENAI_API_KEY`를 추가합니다.
4. 실제 광고 슬롯을 사용할 예정이면 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484`도 추가합니다.
5. 배포합니다.

## 참고

- 분석 결과는 시나리오 기반이며 투자 조언이 아닙니다.
- 히스토리는 브라우저 `localStorage`에 저장됩니다.
- AdSense 사이트 인증용 `public/ads.txt`가 포함되어 있습니다.
