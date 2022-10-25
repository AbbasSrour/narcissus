import cn from 'classnames';
import React, { Suspense, lazy, useState, useRef, useEffect } from "react";

import packageJson from '../../../package.json';
import {stylesContainer} from './app.module.less';
import {stylesHeader, stylesImage, stylesLink, experience as experienceStyle, experienceCanvas} from './app.module.scss';
import Experience from "@src/experience/Experience";

// const LazyStrawberryIcon = lazy(() => import('./strawberry'));
export const App = (): React.ReactElement => {
  const [experience, setExperience] = useState<Experience>()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref && ref.current) setExperience(Experience.create({ targetedElement: ref.current }))
  }, [ref, experience])

  return(
    <div className={stylesContainer}>
        {/*<div className={stylesHeader}>It works</div>*/}
        {/*<Suspense fallback={'loading...'}>*/}
        {/*    <LazyStrawberryIcon className={stylesImage} />*/}
        {/*</Suspense>*/}
      <div className={experienceStyle}>
        <canvas className={experienceCanvas} ref={ref} />
      </div>
        {/*<div>*/}
        {/*    <a*/}
        {/*        className={cn(stylesLink)}*/}
        {/*        href="https://github.com/glook/webpack-typescript-react"*/}
        {/*        target="_blank"*/}
        {/*    >*/}
        {/*        @glook/webpack-typescript-react ({packageJson.version})*/}
        {/*    </a>*/}
        {/*</div>*/}
    </div>
)};
