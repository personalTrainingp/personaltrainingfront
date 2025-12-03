import React from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const App = () => {
  return (
    <div>
        <ColorEmpresa
          childrenChange={
            <App2 idEmpresa={598}/>
          }
          childrenCircus={
            <App2 idEmpresa={599}/>
          }
          childrenReducto={
            <App2 idEmpresa={599}/>
          }
        />
    </div>
  )
}
