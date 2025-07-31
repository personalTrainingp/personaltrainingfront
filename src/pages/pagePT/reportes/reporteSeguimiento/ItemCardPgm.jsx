import React from 'react'
import { Card } from 'react-bootstrap';
import { FormatTable } from './Component/FormatTable';

export const ItemCardPgm = ({notas, avatarPrograma, isSesion, aforo, aforoTurno, isViewGenere, arrayEstadistico, labelParam, onOpenModalSOCIOS, isViewSesiones, isTarifaCash}) => {
  
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
            <div className='fs-1'>
              {notas}
            </div>
        </Card.Body>
    </Card>
  )
}
