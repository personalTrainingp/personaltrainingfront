import { onViewSection } from '@/store/data/dataSlice';
import { ReactNode, useEffect } from 'react';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

const PageBreadcrumb = ({ subName, title, children, topTitle, btnBack }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(onViewSection(topTitle?topTitle:title))
    }, [title, topTitle])
  
  return (
    <>
      <Helmet>
        <title>{title} | change the slim studio</title>
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
              {/* <h3 className="text-uppercase fw-bolder text-primary" style={{fontSize: 25}}>
                {title}
                {children ?? null}
              </h3> */}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PageBreadcrumb;
