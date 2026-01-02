import React, { useState } from 'react'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { App2 } from './App2'
import { PageBreadcrumb } from '@/components'

export const App = () => {
    return (
    <div>
        <ColorEmpresa
            childrenChange={<App2  idEmpresa={598}/>}
        />
    </div>
  )
}
