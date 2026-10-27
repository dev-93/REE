# REE — 희토류 공급망 대시보드

비중국산 희토류(REE) 공급망을 지도에서 보여주는 대시보드 프로토타입입니다. 카자흐스탄 광산·철도 거점, 중앙 회랑(TITR) 경로, 해상 경유지를 Mapbox 지도에 표시하고, 광산에서 항구까지 가는 물류 경로를 시뮬레이션합니다.

## 화면

| 탭 | 상태 | 내용 |
| --- | --- | --- |
| 개요 / 공급망 지도 | 구현 | 거점·광산 마커, DB 상태 위젯, 시세·공급망 안정성 카드 |
| 물류 루트 시뮬레이터 | 구현 | 경로 표시, 총 거리·예상 소요 시간 |
| 희토류 시세 분석, 광산 데이터베이스 | 메뉴만 있음 | 미구현 |

> 개요 화면의 희토류 시세와 공급망 안정성 점수는 하드코딩된 예시 값입니다.

## 기술 스택

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, Framer Motion, Lucide Icons
- Mapbox GL (`mapbox-gl`)
- Supabase (`stations`, `mines`, `rail_lines` 테이블)

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값 입력
npm run dev                  # http://localhost:3000 (브라우저 자동 열림)
npm run build
npm run lint
```

### 환경 변수

| 이름 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox 지도 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |

## 데이터 스크립트

| 파일 | 설명 |
| --- | --- |
| `seed-data.js` | `stations`, `mines` 테이블을 **전부 삭제한 뒤** 시드 데이터를 다시 넣음 |
| `seed-rail-data.js` | `rail_lines` 테이블에 철도 노선(LINESTRING) 추가 |
| `check-db-schema.js` | `mines` 테이블 컬럼 확인 |
| `scripts/fetch_borders.py` | Natural Earth에서 한국·카자흐스탄 국경 GeoJSON을 받아 `public/`에 저장 |

Node 스크립트는 `.env.local`을 읽습니다. 실행 예: `node seed-data.js`

## 폴더 구조

```
src/
├── app/            # page.tsx (탭 상태 관리), layout, globals.css
├── components/     # Sidebar, InteractiveMap, DBStatusWidget, LogisticsSimulator, RouteMetrics
└── utils/          # supabase-client
public/             # 국경 GeoJSON
```

AI 코딩 도구용 작업 규칙은 [AGENTS.md](./AGENTS.md)를 참고합니다.
