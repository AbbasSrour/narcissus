'use client';

import Head from 'next/head';
import * as React from 'react';

import { HeroComponentHorizontal } from '@/components/hero/hero.component';

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Abbas Srour</title>
      </Head>
      <section
        className={
          'bg-white w-screen h-screen flex items-center justify-center align-middle'
        }
      >
        <HeroComponentHorizontal />
      </section>
    </main>
  );
}
