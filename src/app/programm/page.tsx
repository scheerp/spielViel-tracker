'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import FancyLoading from '@components/FancyLoading';

const CommonNinjaPage = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!isScriptLoaded) return <FancyLoading />;

  return (
    <>
      <Head>
        <title>Programm</title>
        <meta
          name="description"
          content="Page displaying Common Ninja component"
        />
      </Head>

      <div className="m-auto mt-16">
        <div className="commonninja_component pid-c80bc464-3b68-4641-adca-8ab846debd0d"></div>
      </div>
    </>
  );
};

export default CommonNinjaPage;
