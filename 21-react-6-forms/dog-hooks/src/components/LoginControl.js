import React, { useState } from 'react'
import Greeting from './Greeting'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

const LoginControl = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const handleLoginClick = () => setIsLoggedIn(!isLoggedIn) // true
  const handleLogoutClick = () => setIsLoggedIn(!isLoggedIn) // false

  const button = isLoggedIn ? (
    <LogoutButton onClick={handleLogoutClick} />
  ) : (
      <LoginButton onClick={handleLoginClick} />
  )

  return (
    <React.Fragment>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </React.Fragment>
  )
}

export default LoginControl
