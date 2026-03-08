'use client';

import { useState } from 'react';
import { X, Send, MapPin } from 'lucide-react';
import { Region } from '@/types';

interface ReportModalProps {
  onClose: () => void;
}

const REGIONS: Region[] = ['서울', '경기', '인천', '충청', '전라', '경상', '강원', '제주'];

export default function ReportModal({ onClose }: ReportModalProps) {
  const [form, setForm] = useState({
    shopName: '',
    address: '',
    region: '' as Region | '',
    description: '',
    phone: '',
    contact: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to backend/API
    console.log('Report submitted:', form);
    setSubmitted(true);
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg font-['Nanum_Myeongjo']">🌿 맛집 제보하기</h2>
            <p className="text-green-100 text-xs mt-0.5">봄동 비빔밥 맛집을 알려주세요!</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-bold text-lg text-green-700 mb-2">제보 감사합니다!</h3>
            <p className="text-sm text-gray-500 mb-6">
              소중한 정보는 검토 후 지도에 반영됩니다.
              <br />더 많은 봄동 맛집을 함께 찾아요!
            </p>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                식당명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="예: 봄동밥상"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  지역 <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value as Region })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="02-1234-5678"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                주소 <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="서울 마포구 서교동"
                  className="flex-1 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                한줄 소개 <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="봄동 비빔밥의 특징을 간략히 설명해 주세요"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                제보자 연락처 (선택)
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="카카오톡 아이디 또는 이메일"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Send size={15} />
              제보 접수하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
