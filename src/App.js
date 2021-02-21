import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react'
import { useRoutes } from 'hookrouter'

import AdminPage from './components/AdminPage'
import Login from './components/Login'
import UserPage from './components/UserPage'
import { navigate } from 'hookrouter'

const App = () => {

  const [currentRoute, setCurrentRoute] = useState('/')

  const handleRedirects = () => {

    const user = JSON.parse(sessionStorage.getItem("user"))

    if (!user) {
      navigate('/')
      setCurrentRoute('/')
    } else if (user.role === "user") {
      navigate('/userpage')
      setCurrentRoute('/userpage')
    } else if (user.role === "admin") {
      navigate('adminpage')
      setCurrentRoute('/userpage')
    } else {
      navigate('/')
      setCurrentRoute('/')
    }
  }

  const routes = {
    "/": () => <Login handleRedirects={handleRedirects} />,
    "/adminpage": () => <AdminPage handleRedirects={handleRedirects} />,
    "/userpage": () => <UserPage handleRedirects={handleRedirects} />
  };

  const routeResult = useRoutes(routes)

  const init = () => {
    const usersChoices = JSON.parse(localStorage.getItem("usersChoices"))
    if (!usersChoices) {
      localStorage.setItem("usersChoices", "[]")
    }
  }

  useEffect(() => {
    handleRedirects()
  }, [])

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      {routeResult}
    </>
  )
}

export default App
