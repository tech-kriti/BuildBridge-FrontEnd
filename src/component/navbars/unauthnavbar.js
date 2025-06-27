import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import "./unauthnavbar.css"
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
function Header(){

    return<>
             <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
                     <Container>
                         <Navbar.Brand as={Link} to="/" className="brand-text">ProjectCollab</Navbar.Brand>
                         <Navbar.Toggle aria-controls="basic-navbar-nav" />
                         <Navbar.Collapse id="basic-navbar-nav">
                             <Nav className="ms-auto">
                                 <Nav.Link as={HashLink} smooth to="/#about">About Us</Nav.Link>
                                 <Nav.Link as={Link} to="/login" className="nav-btn">Login</Nav.Link>
                                 <Nav.Link as={Link} to="/register" className="nav-btn">Register</Nav.Link>
                             </Nav>
                         </Navbar.Collapse>
                     </Container>
                 </Navbar>
     
     
    </>
}
export default Header;