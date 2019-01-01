import React, { useState } from 'react'
import Greeting from './Greeting'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginClick = () => setIsLoggedIn(true)
  const handleLogoutClick = () => setIsLoggedIn(false)

  const button = isLoggedIn ? (
    <LogoutButton onClick={() => handleLogoutClick()} />
  ) : (
    <LoginButton onClick={() => handleLoginClick()} />
  )

  return (
    <React.Fragment>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </React.Fragment>
  )
}

export default LoginControl
