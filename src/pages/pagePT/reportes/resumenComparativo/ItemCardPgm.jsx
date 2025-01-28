import React from 'react'
import { Card } from 'react-bootstrap';
import { ItemTablePgm } from './ItemTablePgm';
import { FormatTable } from './Component/FormatTable';

export const ItemCardPgm = ({avatarPrograma, aforo, isViewGenere, arrayEstadistico, labelParam, onOpenModalSOCIOS, isViewSesiones, isTarifaCash}) => {
  console.log({arrayEstadistico});
  
  return (
    <Card>
                        <Card.Header className=' align-self-center'>
                            <img src={avatarPrograma.urlImage} height={avatarPrograma.height} width={avatarPrograma.width}/>
                            
                        </Card.Header>
                        <Card.Body>
                          {
                            aforo && (
                              <h1 className='text-center'>AFORO {aforo}</h1>
                            )
                          }
                            <br/>
                            <FormatTable data={arrayEstadistico}/>
                        </Card.Body>
                    </Card>
  )
}
