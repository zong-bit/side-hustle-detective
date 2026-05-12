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
        <link rel="canonical" href="https://side-hustle-detective.vercel.app/" />
        <link rel="alternate" hrefLang="zh-Hans" href="https://side-hustle-detective.vercel.app/" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
