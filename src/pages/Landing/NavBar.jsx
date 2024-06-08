import { Nav, Navbar, Container } from 'react-bootstrap';
import logo from '@/assets/images/logo.png';

const NavBar = () => {

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="py-lg-3 navbar-dark">
      <Container>
        <Navbar.Brand href="/" className="me-lg-5">
          <img src={logo} alt="" className="logo-dark" height={22} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler">
          <i className="mdi mdi-menu"></i>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav as="ul" className="me-auto align-items-center navbar-nav">
            <Nav.Item as="li" className="mx-lg-1">
              <Nav.Link href="" className="active">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-lg-1">
              <Nav.Link href="#features-landing">Features</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-lg-1">
              <Nav.Link href="#pricing-landing">Pricing</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-lg-1">
              <Nav.Link href="#faq-landing">FAQs</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-lg-1">
              <Nav.Link href="#contact-us-landing">Contact</Nav.Link>
            </Nav.Item>
          </Nav>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-0">
              <a
                href="https://themes.getbootstrap.com/product/hyper-react-admin-dashboard-template/"
                target="_blank"
                className="nav-link d-lg-none"
              >
                Purchase now
              </a>
              <a
                href="https://themes.getbootstrap.com/product/hyper-react-admin-dashboard-template/"
                target="_blank"
                className="btn btn-sm btn-light rounded-pill d-none d-lg-inline-flex"
              >
                <i className="mdi mdi-basket me-2" /> Purchase Now
              </a>
            </li>
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
