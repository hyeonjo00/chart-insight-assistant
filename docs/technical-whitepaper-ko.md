# Chart Insight Assistant 기술 백서

## 초록

Chart Insight Assistant는 차트 스크린샷을 구조화된 시나리오 기반 시장 해석으로 변환하는 Next.js 애플리케이션입니다. 이 프로젝트는 업로드 UI, 서버 사이드 이미지 검증, OpenAI 기반 비전 분석, 구조화된 JSON 출력, 브라우저 로컬 히스토리, Google AdSense 준비 구조를 하나의 제품 흐름으로 연결합니다.

이 시스템의 목표는 확정적인 매매 신호를 제공하는 것이 아닙니다. 사용자가 차트를 해석하는 데 참고할 수 있는 보수적인 시나리오 분석을 제공하되, 미래 가격 움직임을 보장하지 않도록 설계되어 있습니다.

## 제품 목표

이 프로젝트는 다섯 가지 실용적인 목표를 중심으로 설계되었습니다.

- 차트 스크린샷을 쉽게 업로드할 수 있는 흐름 제공
- OpenAI API 키를 서버에서 안전하게 보호
- 자유 문장이 아닌 예측 가능한 구조화 데이터 반환
- 트레이딩 관점에서 빠르게 읽을 수 있는 결과 UI 제공
- 실제 SaaS 제품으로 확장 가능한 작은 아키텍처 유지

## 시스템 아키텍처

```text
Browser
  |
  | FormData로 이미지 업로드
  v
Next.js App Router UI
  |
  | POST /api/analyze
  v
Next.js Route Handler
  |
  | 파일 검증, 이미지 변환, OpenAI 호출
  v
OpenAI Responses API
  |
  | 구조화된 JSON
  v
결과 카드 + localStorage 히스토리
```

앱은 App Router를 사용해 UI 라우트와 서버 API 동작을 분리합니다. 업로드와 결과 표시 흐름은 `components/chart-upload-panel.tsx`에 있고, OpenAI 연동은 `app/api/analyze/route.ts`에 격리되어 있습니다.

## 프론트엔드 설계

프론트엔드는 Analyze 페이지를 중심으로 구성됩니다. 업로드 패널은 파일 선택, 드래그 앤 드롭 상태, 미리보기 URL, 로딩 상태, API 오류, 분석 결과, 로컬 히스토리 저장을 관리합니다.

핵심 설계 선택:

- 요청 전 클라이언트에서 파일을 먼저 검증합니다.
- 유효한 파일이 선택되면 즉시 미리보기를 표시합니다.
- 유효한 이미지가 없으면 Analyze 버튼은 비활성화됩니다.
- 로딩 UI는 페이지를 막지 않고 스켈레톤 형태로 표시됩니다.
- 결과 카드에서는 `Bias`와 `Confidence`를 배지로 강조합니다.
- 결과 카드에는 항상 면책 문구가 표시됩니다.

## API 라우트 설계

서버 라우트는 `multipart/form-data`로 업로드된 차트 이미지를 받습니다. 이후 OpenAI에 보내기 전에 서버에서 다시 이미지를 검증합니다.

서버의 역할:

- `process.env.OPENAI_API_KEY`에서 API 키 읽기
- 유효한 업로드 파일이 없으면 요청 거부
- 지원하는 이미지 MIME 타입만 허용
- 기본 파일 크기 제한 적용
- 이미지를 base64 data URL로 변환
- 이미지와 프롬프트를 OpenAI로 전송
- 구조화된 JSON 출력 요청
- 반환된 JSON을 검증한 뒤 클라이언트로 응답

이 구조는 브라우저에 비밀 키를 노출하지 않고, 안전 규칙을 서버 한 곳에서 관리할 수 있게 합니다.

## OpenAI 프롬프트 전략

분석 프롬프트는 의도적으로 보수적으로 설계되어 있습니다. 모델은 업로드된 차트 스크린샷을 분석하되, 유효한 JSON만 반환하고, 확정적인 표현을 피하며, 차트가 불분명한 경우 `neutral` bias와 `low` confidence를 사용하도록 지시받습니다.

이 방향은 기능을 신호 판매가 아니라 시나리오 분석 제품에 가깝게 유지합니다.

## 구조화된 출력 계약

UI는 API가 다음 형태를 반환한다고 가정합니다.

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

프론트엔드는 이 응답을 `Long`, `Short`, `Neutral`, `Low`, `Medium`, `High` 같은 표시용 라벨로 매핑합니다.

## 로컬 히스토리 저장

완료된 분석 결과는 브라우저 `localStorage`에 저장됩니다. 이를 통해 MVP 단계에서 계정과 데이터베이스 복잡도를 추가하지 않고도 히스토리 기능을 제공합니다.

저장 필드:

- `id`
- `createdAt`
- `bias`
- `confidence`
- `summary`
- `entryZone`
- `invalidationZone`
- `takeProfitTargets`
- 선택적 경량 이미지 미리보기

히스토리 헬퍼는 저장 항목 수를 제한해 브라우저 저장소 사용량이 과도하게 커지지 않도록 합니다.

## AdSense 준비 구조

프로젝트는 핵심 제품 흐름을 해치지 않으면서 수익화 준비 구조를 포함합니다.

AdSense 관련 구성:

- `app/layout.tsx`에서 전역 스크립트 로드
- `components/ad-banner.tsx`의 재사용 가능한 광고 슬롯
- 사이트 인증용 `public/ads.txt`
- 레이아웃 이동을 줄이기 위한 안정적인 광고 영역

실제 광고 노출에는 AdSense에서 발급한 유효한 슬롯 ID가 필요합니다.

## 보안 및 안정성

주요 안전장치:

- OpenAI API 키는 서버에만 존재합니다.
- 브라우저는 OpenAI API 키를 받지 않습니다.
- 업로드 파일은 클라이언트와 서버에서 모두 검증됩니다.
- OpenAI 출력은 알려진 JSON 형태로 제한됩니다.
- UI에는 투자 조언이 아니라는 면책 문구가 포함됩니다.
- 분석은 시나리오 기반이며 결과를 보장하지 않습니다.

## 현재 한계

- 히스토리는 브라우저에만 저장됩니다.
- 사용자 인증이 아직 없습니다.
- 영구 데이터베이스가 아직 없습니다.
- rate limit이 아직 없습니다.
- 티커, 거래소, 타임프레임 메타데이터를 자동 추출하지 않습니다.
- 실제 AdSense 슬롯 ID 설정이 필요합니다.

## 향후 로드맵

- 사용자 계정 인증 추가
- 분석 히스토리 데이터베이스 저장
- 심볼, 거래소, 타임프레임 메타데이터 추가
- 저장 가능한 프롬프트 또는 분석 프리셋 추가
- API rate limit 추가
- 프로덕션 로그와 관측성 추가
- 히스토리 필터링 및 비교 도구 개선

## 결론

Chart Insight Assistant는 업로드, 검증, 분석, 구조화 결과 렌더링, 히스토리 저장, 배포 준비까지 이어지는 완성형 AI 제품 흐름을 작은 코드베이스 안에 구현합니다. 아키텍처는 의도적으로 단순하지만, 제품 고도화, 수익화, 장기 확장을 위한 경로를 분명하게 남겨두고 있습니다.
