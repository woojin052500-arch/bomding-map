import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '전국 봄동비빔밥 지도 | 봄동맵 Bomdong Map',
  description:
    '전국 봄동비빔밥 맛집을 한눈에! 내 위치에서 가장 가까운 봄동 비빔밥 맛집을 찾아보세요. 봄나물, 보리밥, 제철 비빔밥 전국 300곳+ 정보 제공.',
  keywords: [
    '봄동비빔밥 지도',
    '전국 봄동 맛집',
    '제철 비빔밥',
    '봄나물 지도',
    '봄동 맛집',
    '보리밥 맛집',
    '강호동 봄동비빔밥',
    '봄동 겉절이 비빔밥',
  ],
  openGraph: {
    title: '전국 봄동비빔밥 지도 🌿 봄동맵',
    description: '내 위치에서 가장 가까운 봄동 비빔밥 맛집 찾기! 전국 300곳+ 봄동 맛집 정보',
    type: 'website',
    locale: 'ko_KR',
    siteName: '봄동맵 Bomdong Map',
  },
  twitter: {
    card: 'summary_large_image',
    title: '전국 봄동비빔밥 지도 🌿',
    description: '내 위치에서 가장 가까운 봄동 비빔밥 맛집을 찾아보세요!',
  },
  authors: [{ name: '염우진' }],
  creator: '염우진',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="E5TEsQNn_l2dxapkL1Vjq-2hWVeVh7csifgYXS1CUZo" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Pretendard:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

      </head>
      <body>{children}</body>
    </html>
  );
}
