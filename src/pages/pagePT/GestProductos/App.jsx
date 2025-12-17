import React, { useState } from 'react'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { App2 } from './App2'

export const App = () => {
    return (
    <div>
        <ColorEmpresa
            childrenChange={<App2 />}
        />
    </div>
  )
}
