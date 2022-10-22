import './App.scss'
import React, { useEffect, useRef, useState } from 'react'
import Experience from './experience/Experience'

function App() {
  const [experience, setExperience] = useState<Experience>()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref && ref.current) setExperience(Experience.create({ targetedElement: ref.current }))
  }, [ref, experience])

  return (
    <div className='App'>
      <div className={'experience'}>
        <canvas className={'experience-canvas'} ref={ref} />
      </div>
    </div>
  )
}

export default App
