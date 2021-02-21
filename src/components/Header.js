import { navigate } from 'hookrouter'
import React from 'react'
import { useState, useEffect } from 'react'

import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap'


const Header = ({handleRedirects}) => {

  const [welcomeMessage, setWelcomeMessage] = useState(null)

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    handleRedirects()
  }

  const handleWelcomeMessage = () => {
    const user = JSON.parse(sessionStorage.getItem("user"))
    
    if (user.role === "admin") {
      setWelcomeMessage(`Panel administratora: ${user.name} ${user.surname}`)
    } else if (user.role === "user") {
      setWelcomeMessage(`Panel użytkownika: ${user.name} ${user.surname}`)
    } else {
      setWelcomeMessage(``)
    }
  }

  useEffect(() => {
    handleWelcomeMessage()
  }, [])

  return (

    <Navbar bg="light" expand="lg">
      <Container>
          <Navbar.Brand className="mr-auto">{welcomeMessage}</Navbar.Brand>
          <Nav.Link href="#" onClick={() => handleLogout()}>Wyloguj się</Nav.Link>
      </Container>
    </Navbar>

  )
}

export default Header
