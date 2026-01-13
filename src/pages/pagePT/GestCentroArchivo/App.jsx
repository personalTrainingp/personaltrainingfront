import React, { useState } from 'react'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { App2 } from './App2'

export const App = () => {   
  return (
    <>
    <ColorEmpresa
      childrenChange={<App2 idEmpresa={598}/>}
      childrenCircus={<App2 idEmpresa={599}/>}
      childrenRal={<App2 idEmpresa={800}/>}
    />
    </>
  )
}
