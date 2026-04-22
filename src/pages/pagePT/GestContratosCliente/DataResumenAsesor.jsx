import React from 'react'
import { Card } from 'react-bootstrap'

export const DataResumenAsesor = ({f, array, onClickChangeData}) => {
    const objAtenas = array.find(r=>r.nombres_empl==='ATENAS CORAL FIGUEROA DE OTERO')
    const objJesus = array.find(r=>r.nombres_empl==='JESUS CONTRERAS TENORIO')
    const firmadosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.firmados.length+objJesus.firmados.length+objAtenas.firmados.length:f.firmados.length
    const SinfirmadosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.sinFirmas.length+objJesus.sinFirmas.length+objAtenas.sinFirmas.length:f.sinFirmas.length
    const fotosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.fotos.length+objJesus.fotos.length+objAtenas.fotos.length:f.fotos.length
    const sinfotosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.sinFotos.length+objJesus.sinFotos.length+objAtenas.sinFotos.length:f.sinFotos.length
    const contratos = firmadosA + SinfirmadosA
    const fotosSinFoto = fotosA + sinfotosA
    const firmados = firmadosA
    const sinFirmas = SinfirmadosA
    const fotos = fotosA
    const sinFotos = sinfotosA
  return (
    <Card className='p-2'>
        <Card.Title className='fs-3 text-primary'>
            {f.nombres_empl}
        </Card.Title>
        <ul className='text-decoration-none'>
            <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.firmados, `FIRMADOS - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>FIRMADOS:</span> <span className='text-primary'>{firmados}</span> - <span className=''>{((f.firmados.length/contratos)*100).toFixed(2)} %</span>  </li>
            <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.sinFirmas, `NO FIRMADOS - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>SIN FIRMA:</span> <span className='text-primary'>{sinFirmas}</span> - <span>{((f.sinFirmas.length/contratos)*100).toFixed(2)} %</span> </li>
            <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.fotos, `CON FOTO - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>CON FOTO: </span> <span className='text-primary'>{fotos}</span> - <span> </span> {((f.fotos.length/fotosSinFoto)*100).toFixed(2)} %</li>
            <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.sinFotos, `SIN FOTO - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>SIN FOTO:</span> <span className='text-primary'>{sinFotos}</span> - <span></span> {((f.sinFotos.length/fotosSinFoto)*100).toFixed(2)} %</li>
        </ul>
    </Card>
  )
}
