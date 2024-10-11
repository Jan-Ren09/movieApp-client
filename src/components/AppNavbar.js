import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import UserContext from '../context/UserContext';
import { useNavigate, NavLink } from 'react-router-dom';



export default function AppNavbar() {
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">NF</Navbar.Brand>
        <Nav className="me-auto">
          {!user.id ? (
            <>
              <Nav.Link as={NavLink} to="/Login">Log in</Nav.Link>
              <Nav.Link as={NavLink} to="/Register">Register</Nav.Link>
            </>
          ) : (
            <Nav.Link as={NavLink} to="/Logout">Log out</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
