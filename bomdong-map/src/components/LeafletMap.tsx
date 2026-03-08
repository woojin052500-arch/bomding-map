'use client';

import { useEffect, useRef } from 'react';
import { Shop } from '@/types';
import { formatDistance } from '@/lib/haversine';

interface LeafletMapProps {
  shops: Shop[];
  selectedShop: Shop | null;
  onShopSelect: (shop: Shop) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function LeafletMap({
  shops,
  selectedShop,
  onShopSelect,
  userLocation,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const openPopupRef = useRef<any>(null);

  // ── 최초 마운트: Leaflet 동적 import 후 지도 초기화 ──
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Leaflet 기본 아이콘 경로 픽스 (Next.js 환경)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const center: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [36.5, 127.8];

      const map = L.map(mapRef.current!, {
        center,
        zoom: userLocation ? 12 : 7,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // 사용자 위치 마커
      if (userLocation) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;border-radius:50%;background:#1976d2;border:3px solid white;box-shadow:0 2px 8px rgba(25,118,210,0.6)"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('📍 내 위치');
      }

      // 맛집 마커 전체 추가
      addMarkers(L, map, shops, selectedShop);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── shops / selectedShop 변경 시 마커 갱신 ──
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      // 기존 마커 전부 제거
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      addMarkers(L, mapInstanceRef.current, shops, selectedShop);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops, selectedShop]);

  // ── 선택된 가게로 부드럽게 이동 ──
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedShop) return;
    mapInstanceRef.current.flyTo([selectedShop.lat, selectedShop.lng], 15, { duration: 0.6 });
    const marker = markersRef.current.get(selectedShop.id);
    if (marker) marker.openPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  // ── 사용자 위치 마커 갱신 ──
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;
    import('leaflet').then((L) => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#1976d2;border:3px solid white;box-shadow:0 2px 8px rgba(25,118,210,0.6)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('📍 내 위치');
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 12, { duration: 0.8 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  function addMarkers(L: any, map: any, shopList: Shop[], selected: Shop | null) {
    shopList.forEach((shop) => {
      const isSelected = selected?.id === shop.id;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            display:flex;flex-direction:column;align-items:center;
            filter: drop-shadow(0 2px 6px rgba(45,122,58,0.4));
          ">
            <div style="
              background:${isSelected ? '#2d7a3a' : '#ffffff'};
              color:${isSelected ? '#ffffff' : '#2d7a3a'};
              border:2.5px solid #2d7a3a;
              border-radius:50%;
              width:${isSelected ? '38px' : '30px'};
              height:${isSelected ? '38px' : '30px'};
              display:flex;align-items:center;justify-content:center;
              font-size:${isSelected ? '18px' : '14px'};
              transition:all 0.2s;
            ">🌿</div>
            <div style="width:2px;height:7px;background:#2d7a3a;"></div>
          </div>`,
        iconSize: [isSelected ? 38 : 30, isSelected ? 45 : 37],
        iconAnchor: [isSelected ? 19 : 15, isSelected ? 45 : 37],
        popupAnchor: [0, isSelected ? -46 : -38],
      });

      const distHtml = shop.distance !== undefined
        ? `<span style="display:inline-block;background:#e8f5e9;color:#2d7a3a;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;margin-top:4px;">📍 ${formatDistance(shop.distance)}</span>`
        : '';

      const tagsHtml = shop.tags
        .map(t => `<span style="display:inline-block;font-size:10px;background:#f0faf0;color:#2d7a3a;padding:1px 6px;border-radius:99px;margin:2px 2px 0 0;border:1px solid #c8e6c9">${t}</span>`)
        .join('');

      const popupContent = `
        <div style="font-family:'Pretendard',sans-serif;min-width:180px;max-width:240px;">
          <div style="font-weight:700;font-size:14px;color:#1a1a1a;margin-bottom:3px;">🌿 ${shop.name}</div>
          <div style="font-size:11px;color:#888;margin-bottom:5px;">📌 ${shop.address}</div>
          <div style="font-size:12px;color:#555;line-height:1.5;margin-bottom:5px;">${shop.description}</div>
          ${distHtml}
          <div style="margin-top:6px">${tagsHtml}</div>
          ${shop.phone ? `<div style="font-size:11px;color:#aaa;margin-top:6px;">📞 ${shop.phone}</div>` : ''}
          ${shop.hours ? `<div style="font-size:11px;color:#aaa;">🕐 ${shop.hours}</div>` : ''}
        </div>`;

      const marker = L.marker([shop.lat, shop.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, {
          maxWidth: 260,
          className: 'bomdong-popup',
        });

      marker.on('click', () => {
        onShopSelect(shop);
      });

      markersRef.current.set(shop.id, marker);
    });
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .bomdong-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border: 1.5px solid #e8f5e9;
          padding: 0;
        }
        .bomdong-popup .leaflet-popup-content {
          margin: 14px 16px;
        }
        .bomdong-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-control-zoom a {
          font-size: 16px !important;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
