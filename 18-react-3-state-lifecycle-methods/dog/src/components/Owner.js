import React from 'react'

// function Owner(props) {
//   return (
//     <div className='container'>
//         <h1>My owner is {props.name}</h1>
//     </div>
//   )
// }

class Owner extends React.Component {
  render() {
    return (
      <div className='container'>
        <h1>My owner is {this.props.name}</h1>
      </div>
    )
  }
}

export default Owner
