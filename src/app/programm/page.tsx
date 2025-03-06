'use client';
// pages/commonninja.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Loading from '@components/Loading';

const CommonNinjaPage = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Lade das Commoninja-Skript dynamisch
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    // Entferne das Skript, wenn die Komponente entladen wird
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
        {isScriptLoaded ? (
          <div className="commonninja_component pid-c80bc464-3b68-4641-adca-8ab846debd0d"></div>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};

export default CommonNinjaPage;
