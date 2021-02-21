import React from 'react'
import { useState, useEffect } from 'react'

import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap'

const BasketAction = ({ positionId, basket, handleBasket }) => {

  const [add, setAdd] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantityToAdd, setQuantityToAdd] = useState(0)
  const [addedQuantity, setAddedQuantity] = useState(0)

  const handleQuantityToAddChange = (quantity) => {
    setQuantityToAdd(quantity)
  }

  const handleBasketAdd = (e) => {
    e.preventDefault()
    handleBasket(positionId, quantityToAdd, "add")
    setAdd(true)
  }

  const handleBasketCancel = (e) => {
    e.preventDefault()
    handleBasket(positionId, 0, "remove")
    setAdd(false)
  }

  const handleIsAdded = () => {
    const product = basket.find(p => {
      return p.id === positionId
    })

    if (!product) {
      setIsAdded(false)
    } else if (product.quantity > 0) {
      setAddedQuantity(product.quantity)
      setIsAdded(true)
    } else {
      setIsAdded(false)
    }

  }

  useEffect(() => {
    handleIsAdded()
  })

  if (isAdded == false) {
    return (
      <Form>
        <Form.Group as={Row} md="3">
          <Form.Control htmlSize="3" type="number" size="3" onChange={e => handleQuantityToAddChange(e.target.value)} />
          <Form.Label>szt.</Form.Label>
          <Button variant="primary" type="submit" onClick={e => handleBasketAdd(e)}>Dodaj</Button>
        </Form.Group>
      </Form>
    )
  } else {
    return (
      <>
        {`Dodano ${addedQuantity} sztuk`} <Button onClick={e => handleBasketCancel(e)} >Anuluj</Button>
      </>
    )
  }

}

const MenuPosition = ({ position, canChoose, basket, handleBasket }) => {
  return (
    <>
      <Row>
        <Col xs={12} md={8}>
          <Row>
            <Col><p className="positionName">{`${position.name} - ${position.portion}`}</p></Col>
            <Col className="text-right"><p className="positionPrice">{`${position.price} zł`}</p></Col>
          </Row>
          <Row>
            <Col><p className="positionDescription">{position.description}</p></Col>
          </Row>
          
        </Col>
        <Col xs={12} md={4}>
          {canChoose ?
            <BasketAction positionId={position.id} basket={basket} handleBasket={handleBasket} />
            : ""}
        </Col>
      </Row>

    </>

  )
}

const Place = ({ place, canChooseProp, count }) => {

  const [basket, setBasket] = useState([])
  const [canChoose, setCanChoose] = useState(canChooseProp)

  const [isOrderPlaced, setIsOrderPlaced] = useState(false)

  const quantity = basket.reduce((p, c) => {
    return parseFloat(p) + parseFloat(c.quantity)
  }, 0)

  const bill = basket.reduce((p, c) => {
    let product
    for (const menus of place.menu) {
      product = menus.positions.find(m => {
        return m.id == c.id
      })
      if (product != undefined) break
    }
    return parseFloat(p) + (parseFloat(c.quantity) * parseFloat(product.price))
  }, 0)

  const handleBasket = (product, quantity, actionType) => {
    if (actionType === "add") {
      setBasket(basket => [...basket, { id: product, quantity: quantity }])
    } else if (actionType === "remove") {
      setBasket([...basket.filter(p => { return p.id != product })])
    }
  }

  const makeOrder = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const order = {
      user: user.login,
      basket: basket,
      bill: bill
    }

    const currentOrders = JSON.parse(localStorage.getItem("usersChoices"))

    const newOrders = [...currentOrders]
    newOrders.push(order)

    if (!currentOrders) {
      localStorage.setItem("usersChoices", JSON.stringify([order]))
    } else {
      localStorage.setItem("usersChoices", JSON.stringify(newOrders))
    }

    setCanChoose(false)

  }

  return (
    <>
      <Card className="placeCard mainCard" header="1">
        <Card.Body>
          <Row>
            <Col xs={12} md={8}>
              <Card.Title as="h2">{place.name}</Card.Title>
              <Card.Text className="placeAddress">{place.address}</Card.Text>
              <Card.Text className="placeTags">tagi: {place.tags.join(", ")}</Card.Text>
            </Col>
            <Col xs={12} md={4}>
              <Card.Text>Zadzwoń: <a href={`tel: ${place.phoneNumber}`} >{place.phoneNumber}</a></Card.Text>
              <Card.Text><a href={place.websiteAddress}>odwiedź stronę</a></Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              {place.menu.map(m => {
                return (
                  <div key={`${place.name}_category_${m.categoryName}`} className="menuCategory wrapTop">
                    <h4 >{m.categoryName}</h4>
                    {m.positions.map(p => {
                      return <MenuPosition position={p} key={`${place.name}_category_${m.categoryName}_${p.name}`} canChoose={canChoose} basket={basket} handleBasket={handleBasket} />
                    })}
                  </div>
                )
              })}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
        <Row>
          <Col className="text-right orderSummary">
          {canChoose && count == 1 ? <>
            {`Podsumowanie: w koszyku jest ${quantity} sztuk produktów na kwotę ${bill} zł`}
            {quantity > 0 ? <Button variant="primary" onClick={makeOrder}>Zaakceptuj zamówienie</Button> : ""} </>
            :  count == 1 ? "Twoje zamówienie zostało już złożone" : ""}
          </Col>

        </Row> 
    </>
  )
}

export default Place