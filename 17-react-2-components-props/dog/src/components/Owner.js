import React from 'react'

// function Owner(props) {
//   return <h1>My owner is {props.name}</h1>
// }

class Owner extends React.Component {
  render() {
    return <h1>My owner is {this.props.name}</h1>
  }
}

export default Owner
