# 개발 변경 로그

코드를 수정할 때마다 변경한 파일, 코드 위치, 추가하거나 바꾼 기능, 수정 이유를 이 문서에 기록합니다. 최신 기록을 위에 추가합니다.

## 기록 형식

```markdown
## YYYY-MM-DD — 변경 제목

### 변경 목적

이번 작업에서 해결하려는 문제나 추가하려는 기능을 적습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `파일 경로` | 컴포넌트·함수·설정 이름 | 실제 동작 | 이 변경이 필요한 배경 |

### 확인

- 실행한 검사나 직접 확인한 내용을 적습니다.
- 확인하지 못한 항목과 이유가 있으면 함께 남깁니다.
```

---

## 2026-09-05 — Fastify 백엔드 기본 구조 생성

### 변경 목적

API 인증정보를 프런트엔드에 노출하지 않고 외부 관측·예측 데이터를 동일한 형식으로 가공하기 위한 백엔드 골격을 만들었습니다. 실제 인증정보와 응답 명세가 없는 상태에서도 목업 공급자로 서버 실행, 캐시, 오류 응답, 라우트 테스트가 가능하도록 구성했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `package.json`, `package-lock.json` | Fastify, CORS, dotenv, tsx, Node 타입 및 서버 스크립트 | 백엔드 개발 실행, 빌드, 운영 실행 | 현재 TypeScript 프로젝트 안에서 별도 API 서버를 실행하기 위해 수정 |
| `.env.example` | 서버, 공급자, 캐시, 인증 환경변수 예시 | 필요한 설정 이름 안내 | 실제 비밀값을 Git에 올리지 않고 개발 환경을 구성하도록 신규 추가 |
| `.gitignore` | `server-dist` 제외 | 서버 빌드 결과 추적 방지 | 자동 생성 파일이 소스 변경에 포함되지 않도록 수정 |
| `server/tsconfig.json` | NodeNext 서버 컴파일 설정 | 백엔드 TypeScript를 `server-dist`로 빌드 | 프런트 빌드와 실행 환경이 다른 서버 코드를 독립적으로 검사하기 위해 신규 추가 |
| `server/config/env.ts` | `loadConfig` | 포트, 호스트, 공급자, 캐시 TTL 기본값과 검증 | 잘못된 환경변수로 서버가 모호하게 실행되는 상황을 방지하기 위해 추가 |
| `server/domain/types.ts`, `server/domain/errors.ts` | API 데이터·오류 타입 | 포인트 수온 응답과 404·503 오류 형식 정의 | 라우트, 서비스, 공급자가 같은 계약을 사용하도록 추가 |
| `server/data/diveSites.ts` | 개발용 포인트 목록 | 검색과 공급자 조회에 사용할 포인트 제공 | 실제 목록 확정 전에도 서버 흐름을 확인할 수 있도록 추가 |
| `server/providers/temperatureProvider.ts` | `TemperatureProvider` | 외부 공급자 공통 인터페이스 | 국립수산과학원과 Copernicus 구현을 서비스 변경 없이 교체하기 위해 추가 |
| `server/providers/mockTemperatureProvider.ts` | `MockTemperatureProvider` | 날짜·수심별 목업 수온 반환 | 외부 API 없이 라우트와 캐시를 실행·테스트하기 위해 추가 |
| `server/providers/unconfiguredProvider.ts` | `UnconfiguredProvider` | 미구현 실제 공급자 선택 시 명확한 503 오류 | 실제 데이터처럼 잘못 표시하지 않고 설정 부족을 드러내기 위해 추가 |
| `server/cache/memoryCache.ts` | TTL 기반 `MemoryCache` | 공급자 정상 응답의 일시 저장과 만료 | 외부 API 중복 호출을 줄일 기본 경계를 만들기 위해 추가 |
| `server/services/waterTemperatureService.ts` | `WaterTemperatureService` | 포인트 검색, 상세 조회, 캐시 hit·miss 처리 | HTTP 라우트와 데이터 조회 규칙을 분리하기 위해 추가 |
| `server/routes/health.ts`, `server/routes/sites.ts` | 상태·검색·상세 라우트 | `/health`, `/api/sites`, `/api/sites/:siteId` 제공 | 프런트엔드가 사용할 최소 HTTP API를 만들기 위해 추가 |
| `server/app.ts`, `server/index.ts` | 서버 조립, CORS, 오류 처리, 실행 | 설정에 맞는 공급자 선택과 Fastify 서버 시작 | 테스트 가능한 앱 생성과 실제 포트 실행을 분리하기 위해 추가 |
| `server/config/env.test.ts`, `server/cache/memoryCache.test.ts`, `server/app.test.ts` | 백엔드 테스트 11개 | 환경변수, TTL 만료, 상태, 검색, 캐시, 날짜 오류, 404, 503 검증 | 백엔드 구조가 실제 데이터 연동 전에도 계약대로 작동하는지 확인하기 위해 추가 |
| `README.md` | 백엔드 실행, API, 폴더 구조 | 서버 사용 방법 안내 | 다음 개발자가 실행과 실제 공급자 교체 지점을 파악하도록 수정 |

### 확인

- `npm test`: 프런트·백엔드 테스트 파일 6개, 테스트 37개가 모두 통과했습니다.
- `npm run build`: 프런트 TypeScript, 서버 TypeScript, Vite 프로덕션 빌드가 성공했습니다.
- 개발 서버를 `127.0.0.1:8787`에서 실행해 `/health`, `/api/sites?q=동해`, `/api/sites/mock-east-1`의 200 응답과 `X-Cache: miss` 헤더를 확인한 뒤 종료했습니다.
- 실제 국립수산과학원·Copernicus 네트워크 호출은 아직 구현하지 않았습니다.

---

## 2026-09-05 — 핵심 로직 단위 테스트 추가

### 변경 목적

실제 관측·예측 데이터를 연결할 때 계산 오류와 응답 형식 변경을 빠르게 발견할 수 있도록 수온 도메인, HTTP 공급자, 로컬 저장 경계에 자동화된 단위 테스트를 추가했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `package.json`, `package-lock.json` | Vitest 의존성과 `test`, `test:watch` 스크립트 | 전체 테스트 1회 실행 및 개발 중 감시 실행 | Vite·TypeScript 구성과 호환되는 테스트 환경을 제공하기 위해 수정 |
| `src/domain/waterTemperature.test.ts` | 도메인 테스트 14개 | 날짜별 예보, 대체 예보, 빈 데이터, 수심 필터, 수온 범위, 하락 구간, 오래된 시각, 응답 타입 검증 | 수온 그래프와 경고의 기준이 되는 계산 결과를 고정하기 위해 신규 추가 |
| `src/services/waterTemperatureProvider.test.ts` | HTTP 공급자 테스트 6개 | 검색어 인코딩, 정상 응답, 잘못된 형식, 404, 재시도, 시간 초과, 연결 실패 검증 | 실제 API 연결 시 네트워크 상황별 동작을 자동으로 확인하기 위해 신규 추가 |
| `src/hooks/useLocalStorage.test.ts` | 로컬 저장 테스트 6개 | 기본값, 정상 JSON, 손상된 JSON, 타입 불일치, 직렬화, 저장 오류 검증 | 브라우저 저장 데이터가 손상되거나 저장 공간 오류가 생긴 상황을 확인하기 위해 신규 추가 |
| `src/hooks/useLocalStorage.ts` | `readStoredValue`, `writeStoredValue` | 저장소 읽기·쓰기를 독립적으로 검사 가능한 함수로 분리 | React 렌더링과 무관하게 저장 경계의 동작을 검증하기 위해 수정 |
| `src/services/waterTemperatureProvider.ts` | 타이머를 `globalThis` 기반으로 변경 | 브라우저와 테스트·서버 환경에서 동일한 시간 초과 처리 | `window`가 없는 환경에서 API 공급자가 즉시 실패하는 문제를 테스트 중 발견해 수정 |
| `README.md` | 테스트 명령과 범위 | 테스트 실행 방법 안내 | 이후 변경 작업에서 같은 검증 절차를 반복할 수 있도록 수정 |

### 확인

- `npm test`: 테스트 파일 3개, 테스트 26개가 모두 통과했습니다.
- `npm run build`: TypeScript 검사와 Vite 프로덕션 빌드가 성공했습니다.
- 실제 외부 API 서버에 대한 통합 테스트는 API 주소와 인증정보가 없어 포함하지 않았습니다.

---

## 2026-09-05 — 실제 데이터 연동 전 예외 처리 보완

### 변경 목적

외부 API와 사용자 입력은 목업처럼 항상 완전하지 않으므로 시간 초과, 잘못된 응답, 빈 데이터, 오래된 관측값, 저장 실패가 발생해도 앱 전체가 멈추지 않도록 방어 로직과 사용자 안내를 추가했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `src/services/waterTemperatureProvider.ts` | `HttpWaterTemperatureProvider`, `WaterTemperatureError` | API 시간 초과, 제한된 재시도, HTTP 오류, 404, 네트워크 오류, JSON 응답 검증 | 실제 데이터 공급자가 느리거나 잘못된 값을 보내는 경우를 구분해 처리하기 위해 구현 |
| `src/domain/waterTemperature.ts` | `getForecast`, `getProfileToDepth`, `isTemperatureDataStale`, `isDiveSiteTemperature` | 빈 예보·수심 처리, 6시간 경과 판정, 외부 응답 타입 검사 | 데이터 누락을 정상 값으로 가정해 화면이 중단되는 문제를 방지하기 위해 수정 |
| `src/hooks/useLocalStorage.ts` | 읽기·쓰기 예외와 타입 검증 | 손상된 JSON, 예상과 다른 저장 타입, 저장 용량·권한 오류 처리 | 브라우저 저장소가 정상이라는 가정 없이 기본값 복구와 오류 안내가 가능하도록 수정 |
| `src/components/ErrorBoundary.tsx` | `ErrorBoundary` | 예상하지 못한 렌더링 오류 발생 시 복구 화면과 새로고침 제공 | 한 컴포넌트 오류로 빈 화면만 표시되는 상황을 막기 위해 신규 추가 |
| `src/main.tsx` | 앱을 `ErrorBoundary`로 감싸는 진입 구조 | 앱 전체 렌더링 오류 포착 | 최상위에서 처리되지 않은 화면 오류를 복구 화면으로 전환하기 위해 수정 |
| `src/utils/createId.ts` | `createId` | `crypto.randomUUID` 미지원 환경의 대체 ID 생성 | 일부 브라우저에서 계획과 기록 저장이 실패하지 않도록 신규 추가 |
| `src/App.tsx` | 빈 포인트 처리, 로컬 저장 타입 검사기, 저장 오류 안내 | 포인트 목록이 비어 있거나 로컬 데이터가 손상된 상태에서도 기본 화면 유지 | 외부 데이터 연결 후 빈 응답과 이전 버전 저장값이 들어올 가능성에 대비해 수정 |
| `src/features/dashboard/DashboardPage.tsx` | 빈 포인트·예보·수심 화면, 오래된 데이터 경고, 저장 버튼 비활성화 | 사용할 수 없는 수온으로 계획을 저장하지 않도록 방지 | 누락되거나 오래된 값을 정상 정보처럼 보여주지 않기 위해 수정 |
| `src/features/site-search/SiteSearchPage.tsx` | 예보 배열 안전 조회 | 비교 대상에 예보가 없어도 데이터 없음 표시 | 일부 포인트만 데이터가 누락된 경우 비교 화면 오류를 방지하기 위해 수정 |
| `src/features/saved-sites/SavedSitesPage.tsx` | 입력 검증과 오류 메시지 | 중복·빈 장비, 포인트·날짜 누락, 비정상 수심·수온 저장 방지 | 잘못된 개인 기록이 이후 준비 참고로 사용되지 않도록 수정 |
| `src/styles/global.css` | 오류, 오래된 데이터, 저장 실패, 복구 화면 스타일 | 경고와 일반 정보를 시각적으로 구분 | 사용자가 데이터 상태를 놓치지 않도록 최소 표시 추가 |
| `README.md` | 현재 범위 | 구현된 예외 처리 항목 안내 | 문서와 코드 상태를 일치시키기 위해 수정 |

### 확인

- `npm run build`를 실행했습니다.
- TypeScript 검사와 Vite 프로덕션 빌드가 성공했고 28개 모듈이 변환됐습니다.
- API 호출 구현은 준비됐지만 실제 서버 주소를 연결하지 않아 네트워크별 통합 테스트는 아직 수행하지 않았습니다.

---

## 2026-09-05 — 계획·장비·사후 기록 및 비교 기능 추가

### 변경 목적

실제 해양 데이터를 연결하기 전에 다이빙 준비 흐름과 예외 화면을 목업으로 검증할 수 있도록 계획 저장, 개인 장비 관리, 사후 기록, 포인트 비교, 수온 변화 구간, 오프라인 상태를 구현했습니다. 장비 선택은 자동 추천이 아니라 사용자가 직접 선택하고 과거 기록을 확인하는 방식으로 유지했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `src/domain/waterTemperature.ts` | `EquipmentItem`, `DivePlan`, `DiveLog`, `getLargeTemperatureDrops` | 장비·계획·사후 기록 표현과 구간별 수온 하락 계산 | 화면마다 임의 객체를 만들지 않고 동일한 데이터 구조를 사용하기 위해 확장 |
| `src/hooks/useLocalStorage.ts` | `useLocalStorage` 훅 | 선택 포인트, 저장 포인트, 장비, 계획, 사후 기록을 브라우저에 유지 | 새로고침 후에도 사용자가 입력한 목업 상태를 확인하도록 신규 추가 |
| `src/hooks/useOnlineStatus.ts` | `useOnlineStatus` 훅 | 브라우저의 온라인·오프라인 전환 감지 | 실제 API 연결 전 오프라인 안내가 들어갈 위치와 동작을 검증하기 위해 신규 추가 |
| `src/App.tsx` | 저장 상태와 추가·삭제 함수, 화면 props | 여러 화면의 포인트·장비·계획·기록 상태 연결 | 홈에서 저장한 계획과 장비가 기록 화면에 이어지도록 수정 |
| `src/features/dashboard/DashboardPage.tsx` | 수온 하락 안내, 장비 선택, 메모, 계획 저장 폼 | 설정한 날짜·수심·장비를 다이빙 계획으로 저장 | 수온 확인을 실제 준비 행동으로 연결하고 큰 수온 변화 구간을 확인하도록 수정 |
| `src/features/site-search/SiteSearchPage.tsx` | 비교 선택 상태와 `compare-panel` | 최대 두 포인트의 최저 수온, 기준 거리, 출처 비교 | 어느 포인트의 데이터가 준비에 더 적합한지 나란히 확인하도록 수정 |
| `src/features/saved-sites/SavedSitesPage.tsx` | 계획 목록, 장비 폼, 사후 기록 폼과 목록 | 장비 추가·삭제 및 실제 수심·최저 수온·체감 기록 | 개인 경험을 다음 준비의 참고 자료로 남기는 흐름을 검증하기 위해 수정 |
| `src/styles/global.css` | 오프라인 안내, 비교 카드, 입력 폼, 장비 칩, 기록 목록 스타일 | 추가 기능의 구조와 상태 구분 | 확정 디자인을 만들지 않고 각 입력과 결과 영역을 구별하기 위해 수정 |
| `README.md` | 현재 범위 | 새 목업 기능과 로컬 저장 범위 안내 | 문서에서 현재 구현 상태를 빠르게 파악하도록 수정 |

### 확인

- `npm run build`를 실행했습니다.
- TypeScript 검사와 Vite 프로덕션 빌드가 성공했고 26개 모듈이 변환됐습니다.
- 실제 API 호출, 서버 저장, 사용자 로그인은 포함하지 않았습니다.
- 오프라인에서는 외부 데이터가 아닌 앱에 내장된 목업과 브라우저에 저장된 사용자 입력만 표시합니다.

---

## 2026-09-05 — 다이빙 준비 MVP 목업 구현

### 변경 목적

포인트를 고르고 날짜와 예상 최대 수심을 설정한 뒤, 수심별 예상 수온과 데이터의 한계를 확인하는 흐름을 목업 데이터로 구현했습니다. 수온만 보고 장비를 단정하지 않도록 과거 개인 장비 기록은 추천이 아닌 참고 정보로 구분했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `src/domain/waterTemperature.ts` | `TemperatureForecast`, `DiveSiteTemperature`, `PersonalDiveNote`와 조회 함수 | 날짜별 수심 수온, 출처 정보, 개인 기록 표현 | 포인트 하나의 수온값이 아니라 날짜·수심·데이터 성격을 함께 다루기 위해 확장 |
| `src/data/mockSites.ts` | `mockSites`, `mockPersonalDiveNotes` | 포인트 3개, 날짜 3일, 0~30m 수온과 개인 장비 기록 제공 | 실제 API 없이 검색, 조건 변경, 그래프와 기록 화면을 확인하기 위해 추가 |
| `src/App.tsx` | 선택 포인트 상태와 `selectSite` | 검색 화면에서 포인트를 선택하면 홈 정보 변경 | 화면 사이에서 사용자가 선택한 포인트가 유지되도록 수정 |
| `src/components/TemperatureProfileChart.tsx` | SVG 기반 `TemperatureProfileChart` | 선택 수심까지의 수온 변화를 선 그래프로 표시 | 수온이 내려가는 구간을 표보다 빠르게 파악하도록 신규 추가 |
| `src/features/dashboard/DashboardPage.tsx` | 날짜 선택, 수심 슬라이더, 수온 요약, 출처 카드 | 조건 변경에 따른 표층·최저 수온과 그래프 갱신 | 다이빙 전에 날짜와 최대 수심을 기준으로 정보를 확인하는 핵심 흐름 구현 |
| `src/features/site-search/SiteSearchPage.tsx` | 검색 상태, 결과 필터, 선택 버튼 | 지역·포인트 이름 검색과 포인트 선택 | 목업 환경에서도 실제 탐색 흐름을 눌러볼 수 있도록 수정 |
| `src/features/saved-sites/SavedSitesPage.tsx` | 저장 포인트와 개인 기록 카드 | 과거 최저 수온, 최대 수심, 착용 장비, 메모 확인 | 장비를 자동 추천하지 않고 자신의 이전 선택을 준비 참고로 활용하도록 수정 |
| `src/styles/global.css` | 조건 패널, 그래프, 출처, 검색 결과, 개인 기록 스타일 | 새 UI 요소를 흰색·하늘색 기본 구조로 구분 | 디자인을 확정하지 않고 정보 계층과 상호작용을 확인하기 위해 수정 |
| `src/vite-env.d.ts` | Vite 클라이언트 타입 참조 | CSS import 타입 인식 | TypeScript 빌드에서 전역 CSS import 오류가 발생해 추가 |
| `tsconfig.node.json` | `noEmit` 설정 | Vite 설정 파일 타입 검사 | `allowImportingTsExtensions` 사용 조건을 만족하지 못한 빌드 오류를 해결 |
| `.gitignore` | TypeScript·Vite 빌드 산출물 제외 규칙 | 자동 생성 설정 파일의 Git 추적 방지 | 빌드 결과가 소스 변경으로 표시되지 않도록 수정 |
| `README.md` | 현재 범위 | 구현된 목업 기능 안내 | 프로젝트 문서와 실제 구현 범위를 맞추기 위해 수정 |

### 확인

- `npm run build`를 실행했습니다.
- TypeScript 검사와 Vite 프로덕션 빌드가 성공했고 24개 모듈이 변환됐습니다.
- 모든 장소명, 좌표, 거리, 수온, 장비 기록은 UI 확인용 가상 데이터이며 화면에도 목업임을 표시했습니다.

---

## 2026-09-05 — 앱 목적을 다이빙 전 수온 확인으로 수정

### 변경 목적

앱의 목적은 다이빙 중 실시간 측정이 아니라 입수 전에 포인트의 수심별 수온을 확인해 준비하는 것입니다. 잘못 설정했던 센서 측정과 다이빙 로그 흐름을 제거하고 포인트 검색과 사전 확인 구조로 바꿨습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `src/App.tsx` | `App` 화면 분기 | 홈, 포인트 찾기, 저장한 포인트 화면 전환 | 실시간 측정 중심의 화면 흐름을 사전 탐색 중심으로 교체 |
| `src/components/BottomNav.tsx` | `AppView`, 메뉴 항목 | 포인트 찾기와 저장 메뉴 제공 | 측정·다이빙 기록 메뉴가 앱 목적과 맞지 않아 수정 |
| `src/features/dashboard/DashboardPage.tsx` | `DashboardPage` | 선택한 포인트의 표층·최저 수온 요약 | 다이빙 시작 버튼 대신 사전 수온 확인의 진입점을 제공 |
| `src/features/site-search/SiteSearchPage.tsx` | `SiteSearchPage` | 포인트 검색 영역과 수심별 수온 구조 표시 | 사용자가 다이빙 장소를 기준으로 정보를 찾도록 신규 추가 |
| `src/features/saved-sites/SavedSitesPage.tsx` | `SavedSitesPage` | 자주 확인할 포인트의 저장 화면 골격 | 반복해서 찾는 포인트를 모아보는 후속 기능의 위치를 정의 |
| `src/domain/waterTemperature.ts` | 수온 관련 타입과 요약 함수 | 포인트별 관측 시각, 출처, 수심별 수온 표현 | 다이빙 세션과 측정값 타입을 사전 조회 데이터 구조로 교체 |
| `src/services/waterTemperatureProvider.ts` | `WaterTemperatureProvider` | 외부 수온 데이터 검색·조회 규격 | 센서 대신 해양 관측 데이터 공급원을 연결하기 위한 경계 마련 |
| `src/data/mockSites.ts` | `mockSites` | 화면 확인용 포인트와 수심별 수온 제공 | 실제 데이터 연동 전 구조 확인을 위해 추가하고 실제 정보가 아님을 명시 |
| `src/styles/global.css` | 포인트 요약과 검색 입력 스타일 | 새 화면 요소의 기본 배치 | 디자인을 확정하지 않고도 화면 구조를 구분하기 위해 추가 |
| `README.md` | 소개, 폴더 구조, 현재 범위 | 앱의 사전 수온 확인 목적 설명 | 문서가 실시간 측정 앱으로 안내하지 않도록 수정 |
| 실시간 측정 관련 파일 삭제 | 측정 화면, 센서, 다이빙 로그와 기존 데이터 모델 | 잘못 설정된 기능 제거 | 제품 목적과 다른 개념이 이후 구현 기준으로 남지 않도록 삭제 |

### 확인

- 소스에서 실시간 측정과 센서 연결 문구가 제거됐는지 검색했습니다.
- 의존성이 설치되지 않아 TypeScript 빌드와 브라우저 렌더링은 아직 확인하지 않았습니다.

---

## 2026-09-05 — 화면 색상 단순화

### 변경 목적

디자인이 확정되지 않은 단계에서 화면 구조에 집중할 수 있도록 어두운 수중 테마를 제거하고, 흰 배경과 하늘색 포인트를 사용하는 가벼운 기본 화면으로 변경했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `src/styles/global.css` | 전역 색상 변수, `body`, 버튼, 카드, 상태 표시, 하단 메뉴 스타일 | 전체 화면을 흰색 배경과 하늘색 포인트 색상으로 표시 | 확정된 디자인으로 오해할 수 있는 그라데이션과 강한 수중 테마를 걷어내고 화면 구조를 쉽게 확인하기 위해 수정 |
| `index.html` | `theme-color` 메타 태그 | 모바일 브라우저 상단 영역을 흰색으로 표시 | 본문 배경과 브라우저 UI의 색상을 맞추기 위해 수정 |

### 확인

- CSS에서 기존 어두운 배경과 반투명 카드 색상을 제거했습니다.
- 의존성이 설치되지 않아 브라우저 렌더링은 아직 확인하지 않았습니다.

---

## 2026-09-05 — 프로젝트 초기 구조 및 Git 저장소 설정

### 변경 목적

수심별 수온을 기록하는 스쿠버다이빙 앱을 기능 단위로 개발할 수 있도록 초기 웹앱 구조를 구성했습니다. 센서 종류와 저장 방식이 아직 정해지지 않아 화면, 핵심 데이터, 외부 장치 연결 경계를 분리했습니다.

### 변경 내용

| 파일 | 수정한 코드 | 기능 | 수정 이유 |
| --- | --- | --- | --- |
| `package.json` | Vite, React, TypeScript 의존성과 실행 스크립트 | 개발 서버와 배포용 빌드 실행 | 모바일 웹앱을 빠르게 실행하고 이후 기능을 TypeScript로 확장하기 위해 추가 |
| `index.html`, `src/main.tsx` | 앱 진입점 | React 앱을 브라우저에 표시 | 실행 가능한 최소 진입 구조가 필요해 추가 |
| `src/App.tsx` | `App` 컴포넌트와 화면 상태 | 홈, 측정, 기록 화면 전환 | 초기 단계에서 주요 사용자 흐름을 한 화면씩 확인하기 위해 추가 |
| `src/domain/dive.ts` | `DiveSession`, `TemperatureReading`, 요약 함수 | 다이빙 한 건과 수심별 수온 측정값 표현 | 화면과 저장소가 동일한 데이터 구조를 사용하도록 기준을 만들기 위해 추가 |
| `src/services/temperatureSensor.ts` | `TemperatureSensor` 인터페이스 | 센서 연결, 해제, 측정 규격 정의 | 사용할 장치가 정해진 뒤 화면을 크게 바꾸지 않고 구현체를 연결하기 위해 분리 |
| `src/services/diveRepository.ts` | `DiveRepository` 인터페이스 | 다이빙 기록 조회와 저장 규격 정의 | 브라우저 저장소나 서버 저장 방식이 바뀌어도 기능 코드를 유지하기 위해 분리 |
| `src/data/mockDives.ts` | `mockDives` | 화면 확인용 가상 다이빙 기록 제공 | 실제 데이터 연결 전에도 홈과 로그 화면을 확인할 수 있도록 추가 |
| `src/components/BottomNav.tsx` | `BottomNav` | 홈, 측정, 기록 메뉴 이동 | 모바일 환경에서 주요 기능 사이를 쉽게 이동하도록 추가 |
| `src/components/MetricCard.tsx` | `MetricCard` | 최대 수심과 수온 범위 표시 | 반복되는 요약 정보 표시 방식을 한곳에서 관리하기 위해 추가 |
| `src/features/dashboard/DashboardPage.tsx` | `DashboardPage` | 최근 다이빙 요약과 새 측정 진입 | 앱을 열었을 때 최근 상태와 다음 행동을 바로 확인하도록 구성 |
| `src/features/dive-session/DiveSessionPage.tsx` | `DiveSessionPage` | 센서 연결 전 측정 화면 골격 | 이후 실시간 수심·수온 표시 기능이 들어갈 자리를 먼저 정의 |
| `src/features/dive-log/DiveLogPage.tsx` | `DiveLogPage` | 저장된 다이빙별 최대 수심과 수온 범위 표시 | 과거 다이빙의 수온 변화를 찾아볼 수 있는 기본 목록을 구성 |
| `src/styles/global.css` | 색상, 레이아웃, 모바일 내비게이션 스타일 | 수중 환경을 구분하는 모바일 우선 화면 | 작은 화면에서 측정값과 메뉴를 읽기 쉽게 표시하기 위해 추가 |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts` | TypeScript 및 Vite 설정 | 타입 검사와 React 빌드 환경 구성 | 소스와 빌드 설정을 분리하고 엄격한 타입 검사를 적용하기 위해 추가 |
| `.gitignore` | 생성 파일과 로컬 설정 제외 규칙 | 불필요한 파일의 Git 추적 방지 | 의존성, 빌드 결과, 개인 환경 설정이 저장소에 올라가지 않도록 추가 |
| `README.md` | 프로젝트 범위, 구조, 실행 방법 | 개발 시작 정보 제공 | 새로 참여한 사람이 현재 상태와 실행 방법을 바로 파악하도록 추가 |
| `CHANGE_LOG.md` | 변경 기록 규칙과 최초 기록 | 코드 변경의 목적과 영향을 누적 관리 | 어떤 파일을 왜 수정했는지 이후에도 추적할 수 있도록 추가 |
| `AGENTS.md` | 변경 로그 갱신 규칙 | 코드 변경 시 로그 작성 누락 방지 | 이후 작업에서도 같은 기록 방식을 유지하기 위해 추가 |

### 저장소 설정

- 현재 폴더를 Git 저장소로 초기화했습니다.
- 원격 저장소 `origin`을 `https://github.com/gaeun011019/water_temperature.git`로 등록했습니다.
- 커밋과 원격 푸시는 아직 수행하지 않았습니다.

### 확인

- 프로젝트 내 생성 파일과 디렉터리 구성을 확인했습니다.
- `package.json`과 TypeScript 설정 파일의 JSON 문법을 확인했습니다.
- 의존성을 설치하지 않아 TypeScript 빌드와 브라우저 실행은 아직 확인하지 않았습니다.
