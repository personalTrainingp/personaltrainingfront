import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { useEffect } from 'react';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';

export const CardTotal = ({title, body, span, onClick}) => {
  
  return (
    
		<Card onClick={onClick} style={{height: '200px'}}>
            <Card.Header>
                <Card.Title className='fs-2 text-primary'>
                    {title}
                </Card.Title>
            </Card.Header>
        <Card.Body>
            <ul className='text-decoration-none list-unstyled font-20'>
                <li ><span className='fs-2 fw-bold'>{body} / {span}</span></li>
            </ul>
        </Card.Body>
    </Card>
  )
}
