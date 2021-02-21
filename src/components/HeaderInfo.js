import { navigate } from 'hookrouter'
import React from 'react'
import { useState, useEffect } from 'react'

import usersDb from './../mocks/users.json'

import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap'

const months = {
  "0": "stycznia",
  "1": "lutego",
  "2": "marca",
  "3": "kwietnia",
  "4": "maja",
  "5": "czerwca",
  "6": "lipca",
  "7": "sierpnia",
  "8": "września",
  "9": "października",
  "10": "listopada",
  "11": "grudnia",

}

const days = {
  "0": "niedziela",
  "1": "poniedziałek",
  "2": "wtorek",
  "3": "środa",
  "4": "czwartek",
  "5": "piątek",
  "6": "sobota",
}

const HeaderInfo = ({ type }) => {

  const date = new Date()

  const dateString = `Jest ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} roku, godzina ${date.getHours()}:${date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()}`

  if (type === "admin") {

    const todayKey = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`

    const isAdminChoiceMade = JSON.parse(localStorage.getItem("choicesSetup")) ? JSON.parse(localStorage.getItem("choicesSetup")) : null

    if (isAdminChoiceMade) {

      const countUsersChoices = JSON.parse(localStorage.getItem("usersChoices")) != undefined ? JSON.parse(localStorage.getItem("usersChoices")).length : 0

      const countUsers = usersDb.filter(u => u.role === "user").length

      return (
        <>
          <h3>{dateString}</h3>
          <h3>{`Aktualnie wyboru dokonało ${countUsersChoices} z ${countUsers} użytkowników`}</h3>
          <p>Wybór miejsca na dzisiaj został zdefiniowany i nie może zostać zmieniony</p>
          <p>Ponowny wybór będzie dostępny kolejnego dnia</p>
        </>
      )

    } else {
      return (
        <>
          <h3>{dateString}</h3>
        </>
      )
    }






  } else {
    return (
      <>
        <h3>{dateString}</h3>
      </>
    )
  }


}

export default HeaderInfo
