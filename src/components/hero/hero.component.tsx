import React from 'react';

import { CirclesComponent } from './circles.component';

export const HeroComponentHorizontal = () => {
  return (
    <main className={'bg-purple-500 w-screen h-screen'}>
      <CirclesComponent />
      <div className={'ml-8 mt-14 z-10'}>
        <div className={'flex items-baseline ml-24 max-w-fit -mb-6'}>
          <h1 className={'text-10xl text-white font-marr'}>A</h1>
          <h1 className={'text-9xl text-white font-marr'}>bbas</h1>
        </div>
        <div className={'flex items-baseline max-w-fit flex-row'}>
          <h1 className={'text-10xl text-white font-marr'}>S</h1>
          <h2 className={'text-9xl text-white font-marr'}>rour</h2>
          <span
            className={
              'text-lg text-white flex-wrap w-28 font-marr self-center leading-none ml-6 font-normal'
            }
          >
            Making good shit since 2001
          </span>
        </div>
      </div>
    </main>
  );
};

export const HeroComponentVertical = () => {
  return (
    <div className={'w-1/2 z-10'}>
      <div className={'block w-full text-center'}>
        <span className={'inline-block text-xl font-bold'}>Abbas Srour</span>
      </div>
      <h1>
        <div className={'block w-full text-center'}>
          <span className={'inline-block text-7xl font-bold'}>Copying</span>
        </div>
        <div className={'block w-full text-center'}>
          <span
            className={
              'inline-block text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500'
            }
          >
            COOL
          </span>
        </div>
        <div className={'block w-full text-center'}>
          <span
            className={
              'inline-block text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500'
            }
          >
            SHIT
          </span>
        </div>
        <div className={'block w-full text-center'}>
          <span className={'inline-block text-7xl font-bold'}>SINCE</span>
        </div>
        <div className={'block w-full text-center'}>
          <span className={'inline-block text-7xl font-bold'}>2001</span>
        </div>
      </h1>
    </div>
  );
};
