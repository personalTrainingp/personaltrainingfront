import React from 'react'
import { Card } from 'react-bootstrap';
import { ItemTablePgm } from './ItemTablePgm';
import { FormatTable } from './Component/FormatTable';
import { GrafPie } from './GrafPie';

export const ItemCardPgm = ({grafPie, avatarPrograma, isSesion, aforo, aforoTurno, isViewGenere, arrayEstadistico, labelParam, onOpenModalSOCIOS, isViewSesiones, isTarifaCash}) => {
  const result = arrayEstadistico?.map(subArray => {
    const firstObj = subArray[0]||[]; // Tomar solo el primer objeto de cada subarray
    return {
      val: firstObj?.items?.length || 0, // Si 'items' no existe, devuelve 0
      label: firstObj?.value || '' // Si 'value' no existe, devuelve cadena vacía
    };
  });
  return (
    <Card>
                        <Card.Header className=' align-self-center'>
                            <img src={avatarPrograma.urlImage} height={avatarPrograma.height} width={avatarPrograma.width}/>
                            
                        </Card.Header>
                        <Card.Body>
                          {
                            aforo && (
                              <>
                                <h1 className='text-center'>AFORO POR TURNO {aforo}</h1>
                                <h1 className='text-center'>AFORO POR HORA { aforoTurno}</h1>
                              </>
                            )
                          }
                            <br/>
                            <FormatTable isSesion={isSesion} data={arrayEstadistico}/>
                            
                        </Card.Body>
                        <div className=''>
                            <GrafPie height={700} width={1000} data={result}/>
                        </div>
                    </Card>
  )
}
