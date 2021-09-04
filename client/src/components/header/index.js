import React, {useState} from "react";
import {Navbar, Container, NavDropdown, Nav} from "react-bootstrap";
import styles from './styles.module.css';
import './styles.css';
import Logo from './Logo.png'
import axios from 'axios'
function Header() {
  const [Status, setStatus] = useState(false)

    var User = localStorage.getItem('User')
    User = JSON.parse(User)
    if(User) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': User.token
      }
      var role = User.role
      axios
        .get('/api/'+role+'-protectd', {headers : headers})
        .then((res)=>{
          res.status==200 ? setStatus(role) : setStatus(false)
        })
        .catch((Err)=>{
          console.log(Err)
        })
    }
   
  
    return (
<Navbar bg="dark" expand="lg">
  <Container >
    <Navbar.Brand href="/" className={styles.Text}><img src={Logo} width={"80px"}/></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto" >
        <Nav.Link href="/" className={styles.Text} >Home</Nav.Link>
        <NavDropdown title="Branches" id={styles.Drop}>
          <NavDropdown.Item href="/branches/show">Show</NavDropdown.Item>
          <NavDropdown.Item href="/branches/add">Add</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Staff" id={styles.Drop}>
          <NavDropdown.Item href="/staff/view">View</NavDropdown.Item>
          <NavDropdown.Item href="/staff/add">Add</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Members" id={styles.Drop}>
          <NavDropdown.Item href="/member/view">View</NavDropdown.Item>
          <NavDropdown.Item href="/member/add">Add</NavDropdown.Item>
          <NavDropdown.Item href="/member/reports">View Reports</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="PT" id={styles.Drop}>
          <NavDropdown.Item href="/PT/view">View</NavDropdown.Item>
          <NavDropdown.Item href="/PT/add">Add</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="User" id={styles.Drop}>
          {(Status!=false) ?  
          <><NavDropdown.Item href="#">Current User : {User.name}</NavDropdown.Item>
              <NavDropdown.Item onClick={(event)=> {window.localStorage.removeItem("User")
              window.location.href="/"
            }}>Logout</NavDropdown.Item> </>
          : <NavDropdown.Item href="/login">Login</NavDropdown.Item>}
          <NavDropdown.Item href="/register">SignUp</NavDropdown.Item>
        </NavDropdown>
        {Status ? <Nav.Link id={styles.Drop} href="#">Role : {Status}</Nav.Link> : null}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
    )
}
export default Header;