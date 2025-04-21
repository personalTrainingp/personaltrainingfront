import React from 'react'

export const SymbolSoles = ({numero, isbottom, fontSizeS, classN, bottomClasss}) => {
  return (
    <span className=''>
        <span className={`${fontSizeS?fontSizeS:'fs-3'} ${classN?classN:''} mr-2 position-relative`} style={{bottom: `${bottomClasss}px`}}>
            S
            <span className={`${fontSizeS?fontSizeS:'fs-4'}`}>
            /
            </span>
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
        <span className={`${fontSizeS?fontSizeS:'fs-3'} mr-2 position-relative`} style={{bottom: `${isbottom&&'10px'}`}}>
            $
        </span>
        <span>
            {numero}
        </span>
    </span>
  )
}
