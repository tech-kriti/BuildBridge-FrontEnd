import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt} from 'react-icons/fa';
function Footer(){
    return<>
        <div className="main-footer-section py-5">
                <Container>
                    <Row>
                        {/* About Section */}
                        <Col md={4} sm={12} className="footer-column">
                            <h5>About ProjectCollab</h5>
                            <p>Connecting developers to collaborate on exciting real-world projects with ease, trust, and teamwork.</p>
                        </Col>

                        {/* Quick Links Section */}
                        <Col md={4} sm={12} className="footer-column">
                            <h5>Quick Links</h5>
                            <ul className="footer-links">
                                <li><a href="#about">About Us</a></li>
                                <li><a href="/login">Login</a></li>
                                <li><a href="/register">Register</a></li>
                            </ul>
                        </Col>

                        {/* Contact Section */}
                        <Col md={4} sm={12} className="footer-column">
                            <h5>Contact Us</h5>
                            <p><FaEnvelope /> contact@projectcollab.com</p>
                            <p><FaPhone /> +91 98765 43210</p>
                            <p><FaMapMarkerAlt /> India, Remote Friendly</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-light py-3 mt-auto">
                <Container className="text-center">
                    <small>© 2025 Project Collaboration Hub | Built with ❤️ by Kritika sarva</small>
                </Container>
            </footer>

    </>
}

export default Footer;