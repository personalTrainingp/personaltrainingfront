import React from 'react'

export const SymbolSoles = ({numero, isbottom}) => {
  return (
    <span className=''>
        <span className='fs-3 fw-bold mr-2 position-relative' style={{bottom: `${isbottom&&'10px'}`}}>
            S
            <span className='fs-4'>
            /
            </span>
            . 
        </span>
        <span>
            {numero}
        </span>
    </span>
  )
}
