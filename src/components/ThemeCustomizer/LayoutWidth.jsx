import { ThemeSettings } from '@/common';
import { Row, Form } from 'react-bootstrap';

const LayoutWidth = ({
  handleChangeLayoutWidth,
  layoutWidth,
  layoutConstants,
}) => {
  return (
    <div id="layout-width">
      <h5 className="my-3 font-16 fw-bold">Layout Mode</h5>

      <Row>
        <Form.Check className="col-4">
          <Form.Check className="card-radio">
            <Form.Check.Input
              type="radio"
              name="data-layout-mode"
              id="layout-mode-fluid"
              value={layoutConstants.fluid}
              onChange={(e) => handleChangeLayoutWidth(e.target.value)}
              checked={layoutWidth === layoutConstants.fluid}
            />
            <Form.Check.Label
              className="p-0 avatar-md w-100"
              htmlFor="layout-mode-fluid"
            >
              <div id="sidebar-size">
                <span className="d-flex h-100">
                  <span className="flex-shrink-0">
                    <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                      <span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                    </span>
                  </span>
                  <span className="flex-grow-1">
                    <span className="d-flex h-100 flex-column rounded-2">
                      <span className="bg-light d-block p-1"></span>
                    </span>
                  </span>
                </span>
              </div>

              <div id="topnav-color">
                <span className="d-flex h-100 flex-column">
                  <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                    <span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                  </span>
                  <span className="bg-light d-block p-1"></span>
                </span>
              </div>
            </Form.Check.Label>
          </Form.Check>
          <h5 className="font-14 text-center text-muted mt-2">Fluid</h5>
        </Form.Check>
        <Form.Check className="col-4" id="layout-boxed">
          <Form.Check className="card-radio">
            <Form.Check.Input
              type="radio"
              name="data-layout-mode"
              id="layout-mode-boxed"
              value={layoutConstants.boxed}
              onChange={(e) => handleChangeLayoutWidth(e.target.value)}
              checked={layoutWidth === layoutConstants.boxed}
            />
            <Form.Check.Label
              className="p-0 avatar-md w-100 px-2"
              htmlFor="layout-mode-boxed"
            >
              <div id="sidebar-size" className="border-start border-end">
                <span className="d-flex h-100">
                  <span className="flex-shrink-0">
                    <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                      <span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                    </span>
                  </span>
                  <span className="flex-grow-1">
                    <span className="d-flex h-100 flex-column rounded-2">
                      <span className="bg-light d-block p-1"></span>
                    </span>
                  </span>
                </span>
              </div>

              <div id="topnav-color" className="border-start border-end h-100">
                <span className="d-flex h-100 flex-column">
                  <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                    <span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                    <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                  </span>
                  <span className="bg-light d-block p-1"></span>
                </span>
              </div>
            </Form.Check.Label>
          </Form.Check>
          <h5 className="font-14 text-center text-muted mt-2">Boxed</h5>
        </Form.Check>

        <div className="col-4" id="layout-detached">
          <Form.Check className="sidebar-setting card-radio">
            <Form.Check.Input
              type="radio"
              name="data-layout-mode"
              id="data-layout-detached"
              value={layoutConstants.detached}
              onChange={(e) => handleChangeLayoutWidth(e.target.value)}
              checked={layoutWidth === layoutConstants.detached}
            />
            <Form.Check.Label
              className="p-0 avatar-md w-100"
              htmlFor="data-layout-detached"
            >
              <span className="d-flex h-100 flex-column">
                <span className="bg-light d-flex p-1 align-items-center border-bottom ">
                  <span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
                </span>
                <span className="d-flex h-100 p-1 px-2">
                  <span className="flex-shrink-0">
                    <span className="bg-light d-flex h-100 flex-column p-1 px-2">
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                      <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100"></span>
                    </span>
                  </span>
                </span>
                <span className="bg-light d-block p-1 mt-auto px-2"></span>
              </span>
            </Form.Check.Label>
          </Form.Check>
          <h5 className="font-14 text-center text-muted mt-2">Detached</h5>
        </div>
      </Row>
    </div>
  );
};

export default LayoutWidth;
