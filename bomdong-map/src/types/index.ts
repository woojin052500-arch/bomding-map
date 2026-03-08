export type Region =
  | '서울'
  | '경기'
  | '인천'
  | '충청'
  | '전라'
  | '경상'
  | '강원'
  | '제주';

export interface Shop {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  region: Region;
  description: string;
  tags: string[];
  phone?: string;
  hours?: string;
  distance?: number;
}

export interface ReportFormData {
  shopName: string;
  address: string;
  region: Region;
  description: string;
  phone: string;
  submitterContact: string;
}
