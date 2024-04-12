import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import '../styles/globals.css';

const title = 'Dream Room Generator';
const description = 'Generate your dream room in seconds.';
const ogimage = 'https://roomgpt-demo.vercel.app/og-image.png';
const sitename = 'roomGPT.io';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    // Track page view on route change
    const handleRouteChange = (url) => {
      Analytics.page(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        {/* Define metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogimage} />
        <meta property="og:url" content="https://roomgpt-demo.vercel.app" />
        <meta property="og:site_name" content={sitename} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogimage} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title={title}
        description={description}
        openGraph={{
          type: 'website',
          url: 'https://roomgpt-demo.vercel.app',
          site_name: sitename,
          images: [{ url: ogimage }],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div className="bg-[#17181C] text-white">
        <Component {...pageProps} />
        <Analytics />
      </div>
    </>
  );
};

export default MyApp;
