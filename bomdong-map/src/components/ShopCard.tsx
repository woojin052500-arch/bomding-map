'use client';

import { Shop } from '@/types';
import { formatDistance } from '@/lib/haversine';
import { MapPin, Phone, Clock } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  isSelected: boolean;
  onClick: () => void;
  rank?: number;
}

export default function ShopCard({ shop, isSelected, onClick, rank }: ShopCardProps) {
  return (
    <div
      className={`shop-card cursor-pointer rounded-xl p-4 mb-2 border transition-all ${
        isSelected
          ? 'border-green-600 bg-green-50 shadow-md'
          : 'border-gray-100 bg-white hover:border-green-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {rank !== undefined && (
          <div
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              rank < 3
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {rank + 1}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={`font-bold text-sm truncate ${
                isSelected ? 'text-green-700' : 'text-gray-900'
              }`}
            >
              🌿 {shop.name}
            </h3>
            {shop.distance !== undefined && (
              <span className="flex-shrink-0 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                {formatDistance(shop.distance)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin size={11} />
            <span className="truncate">{shop.address}</span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">
            {shop.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {shop.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>

          {isSelected && (
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 pt-2 border-t border-green-100">
              {shop.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={10} />
                  {shop.phone}
                </span>
              )}
              {shop.hours && (
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {shop.hours}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
