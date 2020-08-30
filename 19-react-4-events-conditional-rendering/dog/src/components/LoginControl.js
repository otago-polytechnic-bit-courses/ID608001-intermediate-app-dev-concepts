import React from 'react'
import Greeting from './Greeting'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

class LoginControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isLoggedIn: false }
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true })
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false })
  }

  render() {
    const { isLoggedIn } = this.state
    const button = isLoggedIn ? (
      <LogoutButton onClick={() => this.handleLogoutClick()} />
    ) : (
      <LoginButton onClick={() => this.handleLoginClick()} />
    )

    return (
      <React.Fragment>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </React.Fragment>
    )
  }
}

export default LoginControl
