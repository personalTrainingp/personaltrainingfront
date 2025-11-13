import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { App2 } from './App2'

export const App = () => {
  return (
    <div>
      <ColorEmpresa
        childrenChange={
          <App2 id_empresa={598}/>
        }
        childrenCircus={
          <App2 id_empresa={599}/>
        }
      />
    </div>
  )
}
