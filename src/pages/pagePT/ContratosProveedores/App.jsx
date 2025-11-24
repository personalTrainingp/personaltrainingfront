import React, { useState } from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const App = () => {
  return (
    <>
    <ColorEmpresa
      childrenChange={
        <App2 id_empresa={598}/>
      }
      childrenCircus={
        <App2 id_empresa={601}/>
      }
      childrenReducto={
        <App2 id_empresa={599}/>
      }
    />
    </>
  )
}
