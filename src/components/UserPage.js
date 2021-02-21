import React from 'react'
import { useState } from 'react'
import './../styles/bgNoImgStyle.css'

import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap'

import usersDb from '../mocks/users.json'
import placesDb from '../mocks/places.json'
import Header from './Header'
import ListPlaces from './ListPlaces'
import HeaderInfo from './HeaderInfo'
import Place from './Place'

import checkIcon from './../common/check.png'

const cardStyles = {
  maxWidth: "75%",
  boxShadow: "0 0 10px 10px black"
}

const UserSubHeader = () => {

  const date = new Date()
  const todayKey = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`

  const chosen = localStorage.getItem("choicesSetup") ? JSON.parse(localStorage.getItem("choicesSetup")) : null

  if (chosen && todayKey == chosen.dateKey) {

    const chosenPlaceInfo = placesDb.find(p => {
      return p.name.split(" ").join("") == chosen.place
    })

    const timeRemaining = new Date(new Date(`01/01/1970 ${chosen.time}:00`) - new Date(`01/01/1970 ${date.getHours()}:${date.getDate()}:00`))

    return (
      <>
        <Card className="headerCard mainCard" header="1">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title as="h2"><img src={checkIcon} className="iconImg" /> Wybór miejsca na dzisiaj został zdefiniowany</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card.Text>
                  Maksymalna godzina: <strong>{chosen.time}</strong>
                </Card.Text>

                {
                  timeRemaining.getTime() > 0 ?
                    <Card.Text>
                      Pozostało: <strong>{`${timeRemaining.getHours()} godzin ${timeRemaining.getMinutes()} minut`}</strong>
                    </Card.Text> :
                    <Card.Text>
                      Minął czas na złożenie zamówienia
                </Card.Text>
                }


              </Col>
            </Row>
            <Row>
              <Col>
                <Card.Text className="positionDescription textColorPrimary wrapTop">
                  Informacje o miejscu
              </Card.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card.Text>
                  <strong>{chosenPlaceInfo.name}</strong>
                </Card.Text>
                <Card.Text>
                  {chosenPlaceInfo.address}
                </Card.Text>
                <Card.Text className="positionDescription">
                  tagi: {chosenPlaceInfo.tags.join(", ")}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>Zadzwoń: <a href={`tel: ${chosenPlaceInfo.phoneNumber}`} >{chosenPlaceInfo.phoneNumber}</a></Card.Text>
                <Card.Text><a href={chosenPlaceInfo.websiteAddress}>odwiedź stronę</a></Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    )
  }
  else {
    return (
      <Card className="headerCard mainCard" header="1">
        <Card.Body>
          <Row>
            <Col >
              <Card.Title as="h2">Nie dokonano wyboru na dzisiaj</Card.Title>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }



}

const UserPage = ({ handleRedirects }) => {

  const chosenKeyName = localStorage.getItem("choicesSetup") ? JSON.parse(localStorage.getItem("choicesSetup")) : null

  const user = JSON.parse(sessionStorage.getItem("user"))

  const hasUserMadeAChoice = JSON.parse(localStorage.getItem("usersChoices")).find(c => {return c.user == user.login}) == undefined ? true : false

  const chosenPlace = chosenKeyName ? placesDb.find(p => {return p.name.split(" ").join("") === chosenKeyName.place}) : null

  return (
    <>
      <Header handleRedirects={handleRedirects} />
      <div className="adminSubHeader">
        <Container>
          <Row>
            <Col xs={12} md={7}>
              <UserSubHeader />
            </Col>
            <Col xs={12} md={4}>
              <HeaderInfo type={"user"} />
            </Col>
          </Row>
        </Container>
      </div>

      {chosenPlace ? 
      <Container>
        <Row>
          <Col xs={12} md={9}>
          <h1>Menu miejsca</h1>
            <Place place={chosenPlace} canChooseProp={hasUserMadeAChoice} count={1} />
          </Col>
          <Col xs={12} md={3}>
            
        </Col>
        </Row>
      </Container>
      : ""}
      <Container>
        <Row>
          <Col xs={12} md={9}>
            <ListPlaces />
          </Col>
          <Col xs={12} md={3}>
            
        </Col>
        </Row>
      </Container>
    </>
  )
}

export default UserPage
