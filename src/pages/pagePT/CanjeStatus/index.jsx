import React from 'react'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { App } from './App'

export default function CanjeStatus() {
  return (
    <div>
      <ColorEmpresa
        childrenChange={<App id_empresa={598} />}
        childrenCircus={<App id_empresa={599} />}
      />
    </div>
  )
}
