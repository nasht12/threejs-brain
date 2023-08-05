import React from 'react'
import BrainRender from './brain-render'
import BrainRender2 from './brain-render2'
import SphereRender from './sphere-render'
import PlainSphereRender from './plain-sphere'
import { Portal } from './components/portal'
import { useRoute, useLocation } from 'wouter'

export default function App() {

  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()

  return (
    <>
      {/* <BrainRender /> */}
      {/* <BrainRender2 /> */}
      {/* <SphereRender /> */}
      {/* <PlainSphereRender /> */}
      <Portal />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
  <a
    style={{
      position: 'absolute',
      top: '40px',
      left: '40px',
      fontSize: '13px',
      pointerEvents: 'auto',
      textDecoration: 'none',
      color: 'black',
    }}
    href="#"
    onClick={() => setLocation('/')}
  >
    {params ? "< back" : "double click to enter portal"}
  </a>
</div>
{' '}
    </>
  )
}
