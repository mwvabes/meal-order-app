import React from 'react'
import {useState} from 'react'
import './../styles/bgImgStyle.css'

import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap'

import usersDb from './../mocks/users.json'

const cardStyles = {
  maxWidth: "75%",
  boxShadow: "0 0 10px 10px black"
}

const Login = ({ handleRedirects }) => {

  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    const user = usersDb.find(u => {
      return u.login == login && u.password == password
    })

    if (user) {
      delete user["password"]
      //logUserIn(user)
      sessionStorage.setItem("user", JSON.stringify(user))
      handleRedirects()
    } else {
      setErrorMessage("Nie udało się zalogować")
    }
    
  }

  const handleLoginChange = (login) => {
    setLogin(login)
  }

  const handlePasswordChange = (password) => {
    setPassword(password)
  }

  return (
    <Container className="loginContainer">
      <Row>
        <Col>
          <h1 className="loginHeading">SYSTEM WSPOMAGANIA ZAMAWIANIA JEDZENIA</h1>
        </Col>
        <Col>
          <Card className="loginCard" header="1">
            <Card.Body>
              <Card.Title as="h1">Zaloguj się</Card.Title>
            <Form>
              <Form.Control type="login" placeholder="LOGIN" onChange={e => handleLoginChange(e.target.value)} />
              <Form.Control type="password" placeholder="HASŁO" onChange={e => handlePasswordChange(e.target.value)} />
              <Button variant="primary" type="submit" onClick={e => handleLogin(e)}>ZALOGUJ</Button>
            </Form>
            {errorMessage ? <Alert variant="danger">
              {errorMessage}
            </Alert> : ""}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
