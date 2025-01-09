import React from 'react'

export const SymbolSoles = ({numero, isbottom, fontSizeS}) => {
  return (
    <span className=''>
        <span className={`${fontSizeS?fontSizeS:'fs-3'} fw-bold mr-2 position-relative`} style={{bottom: `${isbottom&&'10px'}`}}>
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
export const SymbolDolar = ({numero, isbottom, fontSizeS}) => {
  return (
    <span className=''>
        <span className={`${fontSizeS?fontSizeS:'fs-3'} fw-bold mr-2 position-relative`} style={{bottom: `${isbottom&&'10px'}`}}>
            $
            . 
        </span>
        <span>
            {numero}
        </span>
    </span>
  )
}
