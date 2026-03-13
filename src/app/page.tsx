'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script'; // Next.js 스크립트 컴포넌트 추가
import { mockShops } from '@/data/shops';
import { Shop, Region } from '@/types';
import { haversineDistance } from '@/lib/haversine';
import ShopCard from '@/components/ShopCard';
import ReportModal from '@/components/ReportModal';
import {
  MapPin,
  Navigation,
  Search,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  Filter,
  Sprout,
  X,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

const REGIONS: (Region | '전체')[] = ['전체', '서울', '경기', '인천', '충청', '전라', '경상', '강원', '제주'];

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region | '전체'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const shopsWithDistance = useMemo(() => {
    return mockShops.map((shop) => ({
      ...shop,
      distance: userLocation
        ? haversineDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng)
        : undefined,
    }));
  }, [userLocation]);

  const filteredShops = useMemo(() => {
    let result = shopsWithDistance;

    if (activeRegion !== '전체') {
      result = result.filter((s) => s.region === activeRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (userLocation) {
      result = [...result].sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    }

    return result;
  }, [shopsWithDistance, activeRegion, searchQuery, userLocation]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': mockShops.length };
    mockShops.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return counts;
  }, []);

  // 애드핏 광고 컴포넌트
  const AdFit = () => (
    <div className="flex justify-center py-4 bg-gray-50 border-y border-gray-100">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-5W1bo7aYRH8d8xS4"
        data-ad-width="300"
        data-ad-height="250"
      ></ins>
    </div>
  );

  const Sidebar = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 to-green-600 px-5 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sprout size={22} className="text-green-200" />
          <h1 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: 'Nanum Myeongjo, serif' }}>
            봄동맵
          </h1>
          <span className="bg-green-400/30 text-green-100 text-[10px] px-2 py-0.5 rounded-full font-medium">
            BETA
          </span>
        </div>
        <p className="text-green-200 text-xs">전국 봄동비빔밥 맛집 {mockShops.length}곳+</p>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
          <Search size={14} className="text-green-200" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="식당명, 주소, 태그 검색..."
            className="flex-1 bg-transparent text-white placeholder-green-300 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X size={14} className="text-green-200 hover:text-white" />
            </button>
          )}
        </div>

        {/* Location button */}
        <button
          onClick={requestLocation}
          disabled={locationLoading}
          className="mt-3 flex items-center gap-2 text-xs text-green-100 hover:text-white transition-colors"
        >
          <Navigation size={12} className={locationLoading ? 'animate-spin' : ''} />
          {locationLoading
            ? '위치 확인 중...'
            : userLocation
            ? '✓ 내 위치 기준 정렬 중'
            : '내 위치로 거리 정렬'}
        </button>
      </div>

      {/* Region filter */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Filter size={12} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">지역 필터</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                activeRegion === r
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {r}
              <span className={`ml-1 text-[10px] ${activeRegion === r ? 'text-green-200' : 'text-gray-400'}`}>
                {regionCounts[r] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          <span className="font-bold text-green-700">{filteredShops.length}</span>곳
          {userLocation && <span className="ml-1 text-green-600">• 가까운 순</span>}
        </span>
        {selectedShop && (
          <button
            onClick={() => setSelectedShop(null)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            선택 해제
          </button>
        )}
      </div>

      {/* Shop list & AdFit */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {filteredShops.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-sm">검색 결과가 없어요</p>
          </div>
        ) : (
          <>
            {filteredShops.map((shop, i) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                isSelected={selectedShop?.id === shop.id}
                onClick={() => setSelectedShop(shop)}
                rank={userLocation ? i : undefined}
              />
            ))}
            {/* 리스트 하단에 광고 배치 */}
            <AdFit />
          </>
        )}
      </div>

      {/* Report button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setShowReport(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-green-200"
        >
          <PlusCircle size={16} />
          맛집 제보하기
        </button>
      </div>
    </div>
  );

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col">
      {/* 카카오 애드핏 스크립트 로드 */}
      <Script
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        async
        strategy="afterInteractive"
      />

      {/* Desktop: Sidebar + Map */}
      {!isMobile ? (
        <div className="flex h-full">
          <div className="w-96 h-full flex-shrink-0 shadow-xl z-10">{Sidebar}</div>
          <div className="flex-1 relative">
            <LeafletMap
              shops={filteredShops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
              userLocation={userLocation}
            />
            {/* Floating report button */}
            <button
              onClick={() => setShowReport(true)}
              className="floating-btn absolute bottom-8 right-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm z-10"
            >
              <PlusCircle size={16} />
              맛집 제보
            </button>
          </div>
        </div>
      ) : (
        /* Mobile: Full map + Bottom sheet */
        <div className="relative w-full h-full">
          <LeafletMap
            shops={filteredShops}
            selectedShop={selectedShop}
            onShopSelect={(shop) => {
              setSelectedShop(shop);
              setBottomSheetOpen(true);
            }}
            userLocation={userLocation}
          />

          {/* Mobile top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-3">
            <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <Sprout size={18} className="text-green-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="봄동비빔밥 맛집 검색..."
                className="flex-1 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')}>
                  <X size={16} className="text-gray-400" />
                </button>
              ) : (
                <Search size={16} className="text-gray-400" />
              )}
            </div>

            {/* Region filter pills */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 hide-scrollbar">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    activeRegion === r
                      ? 'bg-green-600 text-white shadow'
                      : 'bg-white text-gray-600 shadow-sm'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div
            className={`bottom-sheet absolute left-0 right-0 bottom-0 z-20 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
              bottomSheetOpen ? '' : 'translate-y-[calc(100%-80px)]'
            }`}
            style={{ maxHeight: '70vh' }}
          >
            {/* Handle */}
            <div
              className="flex flex-col items-center pt-3 pb-2 cursor-pointer"
              onClick={() => setBottomSheetOpen(!bottomSheetOpen)}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={14} className="text-green-600" />
                <span>{filteredShops.length}개 맛집</span>
                {userLocation && <span className="text-green-600 text-xs">• 거리순</span>}
                {bottomSheetOpen ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronUp size={16} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* List & AdFit */}
            <div className="overflow-y-auto px-3" style={{ maxHeight: 'calc(70vh - 80px)' }}>
              {filteredShops.slice(0, 50).map((shop, i) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  isSelected={selectedShop?.id === shop.id}
                  onClick={() => {
                    setSelectedShop(shop);
                    setBottomSheetOpen(false);
                  }}
                  rank={userLocation ? i : undefined}
                />
              ))}
              {/* 모바일 리스트 하단 광고 */}
              <div className="pb-8">
                <AdFit />
              </div>
            </div>
          </div>

          {/* Mobile floating buttons */}
          <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-2">
            <button
              onClick={requestLocation}
              className="floating-btn w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
              title="내 위치"
            >
              <Navigation size={18} className={`text-green-600 ${locationLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="floating-btn w-12 h-12 bg-green-600 rounded-full shadow-lg flex items-center justify-center"
              title="맛집 제보"
            >
              <PlusCircle size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </main>
  );
}
