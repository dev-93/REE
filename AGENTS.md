# REE — AI 작업 규칙

비중국산 희토류 공급망(카자흐스탄 광산·철도·중앙 회랑)을 지도로 보여주는 대시보드 프로토타입입니다. 화면과 실행 방법은 [README.md](./README.md)를 참고합니다.

## 스택과 명령

- Next.js 16 App Router, React 19, TypeScript, `@/*` 경로 별칭
- Tailwind CSS 4, Mapbox GL, Supabase
- Prettier: 4칸 들여쓰기, 싱글 쿼트, 세미콜론, trailing comma(es5), printWidth 100

```bash
npm run dev     # :3000
npm run build
npm run lint
```

수정 후 `npm run lint`와 `npm run build`가 통과하는지 확인합니다.

## 구조 규칙

- 탭 상태(`overview`, `map`, `simulator`, `analysis`, `database`)는 `src/app/page.tsx`가 관리하고 `Sidebar`, `InteractiveMap`에 prop으로 내려줍니다. 새 탭을 추가할 때는 `Sidebar`의 `menuItems`와 `page.tsx`의 분기를 함께 수정합니다.
- 지도 레이어 표시·숨김은 `InteractiveMap`에서 `activeTab`으로 결정합니다.
- Supabase 접근은 `src/utils/supabase-client.ts`의 클라이언트를 사용합니다.
- 개요 화면의 시세·안정성 점수는 예시 하드코딩 값입니다. 실제 데이터처럼 설명하지 않습니다.

## 데이터 주의

- `seed-data.js`는 `stations`, `mines` 테이블을 전부 지운 뒤 다시 넣습니다. `seed-rail-data.js`는 `rail_lines`에 중복 추가될 수 있습니다. 사용자가 요청할 때만 실행합니다.
- 좌표는 `[경도, 위도]` 순서입니다(Mapbox, PostGIS `LINESTRING`). 시드 객체의 `lat`/`lng` 필드와 헷갈리지 않게 합니다.

## 환경 변수와 보안

- `.env*`는 `.env.example`만 빼고 git에서 제외됩니다. 로컬 값은 `.env.local`에 둡니다.
- `NEXT_PUBLIC_*` 값은 브라우저에 노출됩니다. Supabase는 anon 키만 쓰고, service role 키를 `NEXT_PUBLIC_`으로 추가하지 않습니다.
- `test-env.js`는 토큰을 콘솔에 출력합니다. 출력 결과를 공유하지 않습니다.
