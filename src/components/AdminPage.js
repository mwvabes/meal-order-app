import React from 'react'
import { useState, useEffect } from 'react'
import './../styles/bgNoImgStyle.css'

import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap'

import usersDb from './../mocks/users.json'
import placesDb from './../mocks/places.json'
import Header from './Header'
import ListPlaces from './ListPlaces'
import HeaderInfo from './HeaderInfo'

import checkIcon from './../common/check.png'

const cardStyles = {
  maxWidth: "75%",
  boxShadow: "0 0 10px 10px black"
}

const ListOrders = () => {

  const [endBill, setEndBill] = useState(null)

  const usersChoices = JSON.parse(localStorage.getItem("usersChoices"))

  const handleEndBill = () => {
    if (usersChoices) {
      const endB = usersChoices.reduce((p, c) => {
        return parseFloat(p.bill) + parseFloat(c.bill)
      }, 0)
      setEndBill(endB)
    }
  }

  useEffect(() => {
    handleEndBill()
  }, [])



  const adminChoice = JSON.parse(localStorage.getItem("choicesSetup"))
  const retrievePlace = adminChoice == undefined ? null : placesDb.find(p => { return p.name.split(" ").join("") === adminChoice.place })

  return (
    <>
      <Row>
        <Col><h1>Złożone zamówienia</h1></Col>
        <Col>{endBill > 0 ? `Kwota: ${endBill} zł` : ""}</Col>
      </Row>

      <Card className="mainCard">
        <Card.Body>
          {!usersChoices || usersChoices.length === 0 ?
            <Row>
              <Col >
                <Card.Title as="h2">Brak zamówień</Card.Title>
              </Col>
            </Row> :
            usersChoices.map(c => {
              const user = usersDb.find(u => { return u.login === c.user })
              return <div key={`${c.user}order`} className="wrapTop"><Row>
                <Col xs={12} md={8}>
                <Row>
                  <Col xs={12} md={8}><Card.Title as="h2">{`${user.name} ${user.surname}`}</Card.Title></Col>
                  <Col xs={12} md={4} className="text-right textColorPrimary billValue">{`${c.bill} zł`}</Col>
                </Row>
                  
                </Col>
                <Col xs={12} md={4}>
                  
                </Col>
              </Row>
                <Row>
                  <Col>
                    {
                      c.basket.map(product => {
                        let position
                        for (const menus of retrievePlace.menu) {
                          position = menus.positions.find(m => {
                            return m.id == product.id
                          })
                          if (position != undefined) break
                        }

                        return (<Row key={`pos${c.user}_${position.id}`}><Col xs={12} md={8}>
                          <Row>
                            <Col><p className="positionName">{`${position.name} - ${position.portion}`}</p></Col>
                            <Col className="text-right"><p>{`${product.quantity} sztuk / ${position.price} zł`}</p></Col>
                          </Row>

                          <p className="positionDescription">{position.description}</p>
                        </Col>
                          <Col xs={12} md={4}>

                          </Col></Row>)

                      })
                    }
                  </Col>
                </Row></div>
            })
          }

        </Card.Body>
      </Card>
    </>
  )

}

const AdminSubHeader = () => {

  const [selectValue, setSelectValue] = useState(placesDb[0].name.split(" ").join(""))
  const [initialTime, setInitialTime] = useState(null)

  const [adminMadeChoice, setAdminMadeChoice] = useState(false)

  const date = new Date()
  const todayKey = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`

  const handleSelectChange = (e) => {
    setSelectValue(e.target.value)
  }

  const handleTimeSet = (e) => {
    setInitialTime(e.target.value)
  }

  const handleAdminChoice = (e) => {
    e.preventDefault()
    localStorage.removeItem("usersChoices")
    localStorage.setItem("choicesSetup", JSON.stringify({ dateKey: todayKey, place: selectValue, time: initialTime }))
    setAdminMadeChoice(true)
  }


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
      <Card className="headerCard" header="1">
        <Card.Body>
          <Row>
            <Col >
              <Card.Title as="h2">Nie dokonano wyboru na dzisiaj</Card.Title>
              <Form>
                <Form.Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Label htmlFor="inlineFormCustomSelect">
                      Wybierz maksymalną godzinę złożenia zamówienia oraz miejsce
                    </Form.Label>
                  </Col>

                </Form.Row>
                <Form.Row className="align-items-center">
                  <Col xs="auto">

                    <Form.Control type="time" placeholder="12:00" onChange={(e) => handleTimeSet(e)} />
                    <Form.Control
                      as="select"
                      id="inlineFormCustomSelect"
                      custom
                      onChange={e => handleSelectChange(e)}
                    >
                      {placesDb.map(p => {
                        return <option value={p.name.split(" ").join("")} key={p.name.split(" ").join("")} >{p.name}</option>
                      })}
                    </Form.Control>
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" type="submit" onClick={e => { handleAdminChoice(e) }}>Zatwierdź</Button>
                  </Col>
                </Form.Row>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }



}

const AdminPage = ({ handleRedirects }) => {



  return (
    <>
      <Header handleRedirects={handleRedirects} />
      <div className="adminSubHeader">
        <Container>
          <Row>
            <Col xs={12} md={7}>
              <AdminSubHeader />
            </Col>
            <Col xs={12} md={4}>
              <HeaderInfo type={"admin"} />
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col xs={12} md={9}>
            <ListOrders />
          </Col>
          <Col xs={12} md={3}>

          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col xs={12} md={9}>
            <ListPlaces type={"admin"} count={0} />
          </Col>
          <Col xs={12} md={3}>

          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminPage
