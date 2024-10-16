import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';

export const CardTotal = ({title, body, span, onClick}) => {
  return (
    
		<Card onClick={onClick}>
        <Card.Body>
            <CardTitle
                containerClass="d-flex align-items-center justify-content-between mb-3"
                title={title}
                menuItems={false}
            />
            <h2>
                {body}
            </h2>
            <h4>
                {span}
            </h4>
        </Card.Body>
    </Card>
  )
}
