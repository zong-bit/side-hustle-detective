import '../styles/globals.css';
import Navbar from './components/Navbar';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="副业侦探 - 聚合全网副业信息，自动甄别骗局，提供靠谱副业推荐和副业赚钱攻略" />
        <meta name="keywords" content="副业,兼职,赚钱,防骗,副业推荐,AI副业,在家赚钱,学生兼职,宝妈副业" />
        <meta property="og:site_name" content="副业侦探" />
        <meta property="og:locale" content="zh_CN" />
        <meta property="og:image" content="https://side-hustle-detective.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="副业侦探" />
        <meta name="twitter:description" content="AI时代的副业赚钱指南，帮你找到最适合你的第二收入来源" />
        <link rel="canonical" href="https://side-hustle-detective.vercel.app/" />
        <link rel="alternate" hrefLang="zh-Hans" href="https://side-hustle-detective.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://side-hustle-detective.vercel.app/#organization",
                  "name": "副业侦探",
                  "url": "https://side-hustle-detective.vercel.app",
                  "description": "AI时代的副业赚钱指南，帮你找到最适合你的第二收入来源",
                  "alternateName": "Side Hustle Detective"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://side-hustle-detective.vercel.app/#website",
                  "name": "副业侦探",
                  "url": "https://side-hustle-detective.vercel.app",
                  "description": "AI时代的副业赚钱指南，帮你找到最适合你的第二收入来源",
                  "publisher": {
                    "@id": "https://side-hustle-detective.vercel.app/#organization"
                  },
                  "inLanguage": "zh-CN"
                },
                {
                  "@type": "WebPage",
                  "@id": "https://side-hustle-detective.vercel.app/#webpage",
                  "url": "https://side-hustle-detective.vercel.app",
                  "name": "副业侦探 - AI时代的副业赚钱指南",
                  "isPartOf": {
                    "@id": "https://side-hustle-detective.vercel.app/#website"
                  },
                  "breadcrumb": {
                    "@id": "https://side-hustle-detective.vercel.app/#breadcrumb"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://side-hustle-detective.vercel.app/#breadcrumb",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "首页",
                      "item": "https://side-hustle-detective.vercel.app"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
