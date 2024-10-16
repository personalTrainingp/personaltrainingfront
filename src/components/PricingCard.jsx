import { Row, Col, Card } from 'react-bootstrap';
import classNames from 'classnames';

const PricingCard = ({ plans, containerClass }) => {
  return (
    <Row className={containerClass}>
      {plans.map((plan, index) => {
        return (
          <Col md={4} key={index.toString()}>
            <Card
              className={classNames('card-pricing', {
                'card-pricing-recommended': plan.isRecommended,
              })}
            >
              <Card.Body className="text-center">
                {plan.isRecommended && (
                  <div className="card-pricing-plan-tag">Recommended</div>
                )}
                <p className="card-pricing-plan-name fw-bold text-uppercase">
                  {plan.name}
                </p>
                <i
                  className={classNames(
                    'card-pricing-icon',
                    plan.icon,
                    'text-primary'
                  )}
                ></i>
                <h2 className="card-pricing-price">
                  {plan.price} <span>/ {plan.duration}</span>
                </h2>
                <ul className="card-pricing-features">
                  {plan.features.map((feature, index1) => {
                    return <li key={index1.toString()}>{feature}</li>;
                  })}
                </ul>
                <button className="btn btn-primary mt-4 mb-2 rounded-pill">
                  Choose Plan
                </button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export { PricingCard };
