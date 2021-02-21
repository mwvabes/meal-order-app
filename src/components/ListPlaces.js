import React from 'react'
import { useState } from 'react'

import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap'

import usersDb from './../mocks/users.json'
import Header from './Header'

import places from './../mocks/places.json'
import Place from './Place'

const cardStyles = {
  maxWidth: "75%",
  boxShadow: "0 0 10px 10px black"
}

const ListPlaces = ({type}) => {

  return (
    <>
    <h1>Dostępne miejsca</h1>
      {
        places.map(p => {
          return <Place place={p} key={p.name} canChooseProp={type === "userOK" ? true : false} count={0} />
        })
      }
    </>
  )
}

export default ListPlaces
