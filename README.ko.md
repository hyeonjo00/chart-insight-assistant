# Chart Insight Assistant

Chart Insight Assistant는 차트 스크린샷을 업로드하고, OpenAI 기반의 시나리오형 분석을 받아보고, 완료된 결과를 브라우저 로컬 히스토리에 저장할 수 있는 포트폴리오용 Next.js 앱입니다. 단순 데모가 아니라 실제 제품으로 확장할 수 있도록 업로드, 서버 API, 결과 카드, 히스토리, AdSense 준비까지 한 흐름으로 구성했습니다.

[English](./README.en.md) | [日本語](./README.ja.md) | [언어 선택 허브](./README.md)

## 스크린샷

| 홈 | 분석 | 분석 완료 | 히스토리 |
| --- | --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![Analysis Result](./public/readme/analysis-result.png) | ![History](./public/readme/history.png) |

## 프로젝트 소개

이 앱은 사용자가 차트 이미지를 업로드하면 서버 라우트를 통해 OpenAI에 이미지를 전달하고, 결과를 정해진 JSON 형태로 받아 화면에 표시합니다. 결과는 단순한 문장이 아니라 Bias, Confidence, Entry Zone, Invalidation Zone, Take Profit Targets, Summary로 나뉘어 렌더링됩니다.

분석은 항상 보수적인 시나리오 기반 해석을 목표로 합니다. 미래 가격을 보장하지 않고, 화면에도 투자 조언이 아니라는 안내를 포함합니다.

## 기술 백서

전체 기술 백서에는 아키텍처, API 파이프라인, OpenAI 프롬프트 전략, 구조화 출력 계약, 로컬 히스토리 모델, AdSense 준비 구조, 보안 설계, 현재 한계, 로드맵을 정리했습니다.

- [한국어 기술 백서 읽기](./docs/technical-whitepaper-ko.md)
- [English Whitepaper](./docs/technical-whitepaper-en.md)
- [日本語 技術ホワイトペーパー](./docs/technical-whitepaper-ja.md)

## 주요 기능

- 다크 테마 기반의 반응형 UI
- Next.js App Router 기반 Home, Analyze, History 페이지
- 드래그 앤 드롭 이미지 업로드
- 클릭해서 이미지 파일 선택
- 업로드 이미지 미리보기
- PNG, JPG, JPEG, WEBP 파일 검증
- 클라이언트와 서버 양쪽의 기본 파일 검증
- `/api/analyze` 서버 라우트를 통한 OpenAI 이미지 분석
- 구조화된 JSON 결과 응답
- Bias와 Confidence를 강조하는 결과 카드
- 브라우저 `localStorage` 기반 분석 히스토리
- 히스토리 항목 개별 삭제
- Google AdSense용 광고 배너 컴포넌트
- 전역 AdSense 스크립트와 `ads.txt` 포함

## 분석 흐름

1. 사용자가 Analyze 페이지에서 차트 스크린샷을 업로드합니다.
2. 프론트엔드가 이미지 형식과 파일 크기를 검증합니다.
3. 업로드 영역에 이미지 미리보기가 표시됩니다.
4. 사용자가 `Analyze Chart` 버튼을 클릭합니다.
5. 프론트엔드가 이미지를 `/api/analyze`로 전송합니다.
6. 서버가 이미지 형식과 크기를 다시 검증합니다.
7. 서버가 보수적인 시나리오형 프롬프트와 함께 이미지를 OpenAI로 보냅니다.
8. OpenAI가 구조화된 JSON을 반환합니다.
9. 앱이 결과 카드를 표시하고 결과를 로컬 히스토리에 저장합니다.

## 분석 결과 구조

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

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프레임워크 | Next.js App Router |
| 언어 | TypeScript |
| UI | React |
| 스타일링 | Tailwind CSS |
| AI | OpenAI Responses API |
| 저장소 | 브라우저 `localStorage` |
| 광고 | Google AdSense 준비 |

## 프로젝트 구조

```text
app/
  api/analyze/route.ts      OpenAI 차트 분석 API 라우트
  analyze/page.tsx          분석 페이지
  history/page.tsx          로컬 히스토리 페이지
  layout.tsx                루트 레이아웃과 전역 AdSense 스크립트
  page.tsx                  홈 페이지
components/
  ad-banner.tsx             재사용 가능한 AdSense 준비 광고 슬롯
  chart-upload-panel.tsx    업로드, 미리보기, 분석 요청, 결과 표시 흐름
  layout/site-header.tsx    상단 네비게이션
  ui/                       재사용 UI 컴포넌트
lib/
  analysis-history.ts       localStorage 히스토리 헬퍼
  utils.ts                  공용 유틸
docs/
  technical-whitepaper-en.md
  technical-whitepaper-ko.md
  technical-whitepaper-ja.md
public/
  ads.txt                   AdSense 인증 파일
  readme/                   README 스크린샷
```

## 시작 방법

1. 의존성을 설치합니다.

   ```bash
   npm install
   ```

2. 프로젝트 루트에 `.env.local` 파일을 만듭니다.

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

| 변수 | 필수 여부 | 설명 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 필수 | `/api/analyze` 서버 라우트에서 OpenAI 호출에 사용 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 선택 | 실제 AdSense 슬롯을 사용할 때 필요한 공개 클라이언트 ID |

## 사용 가능한 스크립트

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | 린트 실행 |
| `npm run type-check` | TypeScript 타입 검사 |

## Vercel 배포

1. 저장소를 GitHub에 푸시합니다.
2. Vercel에서 프로젝트를 Import 합니다.
3. Vercel 환경 변수에 `OPENAI_API_KEY`를 추가합니다.
4. 실제 광고 슬롯을 사용할 예정이면 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484`도 추가합니다.
5. 배포합니다.

## 보안 메모

- OpenAI API 키는 브라우저에 노출되지 않습니다.
- API 키는 서버에서 `process.env.OPENAI_API_KEY`로만 읽습니다.
- 업로드 이미지는 클라이언트와 서버에서 기본 검증을 거칩니다.
- `.env.local`은 저장소에 커밋하지 않아야 합니다.
- 실제 키가 한 번이라도 커밋되었다면 배포 전에 반드시 회전해야 합니다.

## AdSense 메모

- `app/layout.tsx`에서 전역 AdSense 스크립트를 로드합니다.
- `components/ad-banner.tsx`는 재사용 가능한 광고 슬롯을 렌더링합니다.
- `public/ads.txt`는 AdSense 사이트 인증을 위해 포함되어 있습니다.
- 실제 광고 노출에는 Google AdSense에서 발급한 `adSlot` 값이 필요합니다.

## 로드맵

- 사용자 인증 추가
- 분석 히스토리를 데이터베이스에 저장
- 심볼, 거래소, 타임프레임 같은 차트 메타데이터 추가
- 사용자 분석 프리셋 저장
- 분석 API rate limit 추가
- 프로덕션 로그와 모니터링 추가

## 면책 조항

이 프로젝트는 학습 및 포트폴리오 목적입니다. AI 기반 차트 분석은 시나리오형 참고 정보이며 투자 조언이 아닙니다.
