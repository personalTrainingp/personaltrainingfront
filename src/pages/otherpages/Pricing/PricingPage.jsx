import { Row, Col } from 'react-bootstrap';
import { PageBreadcrumb, PricingCard } from '@/components';

const PricingPage = () => {
  const plans = [
    {
      id: 1,
      name: 'Professional Pack',
      icon: 'ri-user-line',
      price: '$19',
      duration: 'Month',
      features: [
        '10 GB Storage',
        '500 GB Bandwidth',
        'No Domain',
        '1 User',
        'Email Support',
        '24x7 Support',
      ],
      isRecommended: false,
    },
    {
      id: 2,
      name: 'Business Pack',
      icon: 'ri-briefcase-line',
      price: '$29',
      duration: 'Month',
      features: [
        '50 GB Storage',
        '900 GB Bandwidth',
        '2 Domain',
        '10 User',
        'Email Support',
        '24x7 Support',
      ],
      isRecommended: true,
    },
    {
      id: 3,
      name: 'Enterprise Pack',
      icon: 'ri-store-2-line',
      price: '$39',
      duration: 'Month',
      features: [
        '100 GB Storage',
        'Unlimited Bandwidth',
        '10 Domain',
        'Unlimited Users',
        'Email Support',
        '24x7 Support',
      ],
      isRecommended: false,
    },
  ];

  return (
    <>
      <PageBreadcrumb title="Pricing" subName="Pages" />

      <Row className="justify-content-center">
        <Col xl={10}>
          <div className="text-center">
            <h3 className="mb-2">Our Plans and Pricing</h3>
            <p className="text-muted w-50 m-auto">
              We have plans and prices that fit your business perfectly. Make your
              client site a success with our products.
            </p>
          </div>

          {/* pricing cards */}
          <PricingCard plans={plans} containerClass={'mt-sm-5 mt-3 mb-3'} />
        </Col>
      </Row>
    </>
  );
};

export { PricingPage };
