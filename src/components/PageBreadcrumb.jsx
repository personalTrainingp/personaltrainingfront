import { ReactNode } from 'react';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const PageBreadcrumb = ({ subName, title, children, btnBack }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Personal training</title>
      </Helmet>
      {subName && (
        <Row>
          <Col>
            <div className="page-title-box my-3">
              <div className="page-title-right">
                <Breadcrumb listProps={{ className: 'm-0' }}>
                  {/* <Breadcrumb.Item as={'li'}>Hyper</Breadcrumb.Item> */}
                  {/* <Breadcrumb.Item as={'li'}>{subName}</Breadcrumb.Item> */}
                  {/* <Breadcrumb.Item as={'li'} active>
                    {title}
                  </Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
              {btnBack && (
                <a className='mdi mdi-chevron-left fw-bold' style={{cursor: 'pointer'}} href={btnBack}>Regresar</a>
              )
              }
              <h3 className="text-uppercase fw-bolder" style={{fontSize: 25}}>
                {title}
                {children ?? null}
              </h3>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PageBreadcrumb;
