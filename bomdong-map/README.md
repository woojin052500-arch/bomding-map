# 🌿 봄동맵 (Bomdong Map)
> 전국 봄동비빔밥 맛집 지도 — 내 위치에서 가장 가까운 봄동 맛집 찾기!

---

## 📸 주요 기능

- **전국 305곳+ 맛집 데이터** (서울 50 / 경기 55 / 인천 15 / 충청 45 / 전라 45 / 경상 50 / 강원 25 / 제주 20)
- **위치 기반 거리 정렬** — Haversine 공식으로 실시간 가까운 순 정렬
- **Naver Maps 커스텀 마커 & 인포윈도우** — 선택 시 세련된 오버레이 팝업
- **지역별 탭 필터 + 검색** — 식당명 / 주소 / 설명 / 태그 통합 검색
- **Desktop + Mobile 반응형** — 데스크톱 좌사이드바 / 모바일 바텀시트
- **맛집 제보 모달** — 사용자 참여형 플랫폼
- **SEO 최적화** — Next.js Metadata API + OpenGraph

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Map | **Leaflet.js + OpenStreetMap** (무료, API 키 불필요) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Nanum Myeongjo + Pretendard |
| Deployment | Vercel |

---

## 🚀 시작하기 (API 키 없이 바로 실행!)

```bash
# 압축 해제 후
cd bomdong-map
npm install
npm run dev
# http://localhost:3000  ← 끝! 별도 설정 없음
```

> **Leaflet + OpenStreetMap** 기반으로 API 키 발급 없이 완전 무료로 사용 가능합니다.

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 메타데이터 + Naver Maps 스크립트 로드
│   ├── page.tsx            # 메인 페이지 (Desktop/Mobile 분기)
│   └── globals.css         # 전역 스타일
├── components/
│   ├── NaverMap.tsx        # 네이버 지도 + 마커 + 커스텀 인포윈도우
│   ├── ShopCard.tsx        # 사이드바/바텀시트 맛집 카드
│   └── ReportModal.tsx     # 맛집 제보 모달
├── data/
│   └── shops.ts            # 전국 305곳+ 맛집 데이터
├── lib/
│   └── haversine.ts        # 하버사인 거리 계산
└── types/
    └── index.ts            # TypeScript 인터페이스
```

---

## 🗺️ 데이터 구조

```typescript
interface Shop {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  region: '서울' | '경기' | '인천' | '충청' | '전라' | '경상' | '강원' | '제주';
  description: string;
  tags: string[];
  phone?: string;
  hours?: string;
  distance?: number; // Haversine 실시간 계산
}
```

---

## 🌱 향후 개선 사항

- [ ] Supabase / PlanetScale 연동으로 실제 DB 운영
- [ ] 맛집 제보 → Admin 검토 → 자동 반영 파이프라인
- [ ] 리뷰 & 별점 시스템
- [ ] 사진 업로드 기능
- [ ] 마커 클러스터링 (100+ 마커 최적화)
- [ ] PWA 지원 (오프라인 캐싱)
- [ ] 카카오 공유하기 SDK 연동
- [ ] 봄동 시즌 알림 (제철: 1~3월)

---

## 📊 지역별 맛집 분포

| 지역 | 수량 |
|------|------|
| 서울 | 50곳 |
| 경기 | 55곳 |
| 인천 | 15곳 |
| 충청 | 45곳 |
| 전라 | 45곳 |
| 경상 | 50곳 |
| 강원 | 25곳 |
| 제주 | 20곳 |
| **합계** | **305곳** |

---

## 📄 라이선스

MIT License © 2025 염우진
