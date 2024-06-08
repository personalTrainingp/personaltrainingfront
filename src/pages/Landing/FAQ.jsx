import { Container, Row, Col } from 'react-bootstrap';
import { FAQs } from '@/components';

const FAQ = ({ rawFaqs }) => {
  return (
    <section className="py-5" id="faq-landing">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="text-center">
              <h1 className="mt-0">
                <i className="mdi mdi-frequently-asked-questions"></i>
              </h1>
              <h3>
                Frequently Asked <span className="text-primary">Questions</span>
              </h3>
              <p className="text-muted mt-3">
                Here are some of the basic types of questions for our customers. For
                more
                <br />
                information please contact us.
              </p>

              <button type="button" className="btn btn-success btn-sm mt-2">
                <i className="mdi mdi-email-outline me-1"></i> Email us your
                question
              </button>
              <button type="button" className="btn btn-info btn-sm mt-2 ms-1">
                <i className="mdi mdi-twitter me-1"></i> Send us a tweet
              </button>
            </div>
          </Col>
        </Row>

        {/* question/answer */}
        <FAQs rawFaqs={rawFaqs} />
      </Container>
    </section>
  );
};

export default FAQ;
