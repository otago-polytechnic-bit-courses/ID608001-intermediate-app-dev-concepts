import React from 'react'

class Owner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: 'Jane Doe' }
  }

  render() {
    return <h1>My owner is {this.state.name}</h1>

  }
}

export default Owner
