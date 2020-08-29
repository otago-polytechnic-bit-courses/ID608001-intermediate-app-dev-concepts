import React from 'react'
import GuestGreeting from './GuestGreeting'
import UserGreeting from './UserGreeting'

class Greeting extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn
    return isLoggedIn ? <UserGreeting /> : <GuestGreeting />
  }
}

export default Greeting
