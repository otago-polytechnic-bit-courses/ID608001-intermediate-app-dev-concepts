import React from 'react'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isRegistered: true,
    }
    // this.handleRegisteredChange = this.handleRegisteredChange.bind(this)
  }

  // handleRegisteredChange = () => {
  //   this.setState((state) => ({
  //     isRegistered: !state.isRegistered,
  //   }))
  // }

  handleRegisteredChange() {
    this.setState((state) => ({
      isRegistered: !state.isRegistered,
    }))
  }

  render() {
    return (
      <React.Fragment>
        {/* <button onClick={this.handleRegisteredChange.bind(this)}>
          {this.state.isRegistered ? 'Registered' : 'Unregistered'}
        </button> */}
        {/* <button onClick={this.handleRegisteredChange}>
          {this.state.isRegistered ? 'Registered' : 'Unregistered'}
        </button> */}
        <button onClick={() => this.handleRegisteredChange()}>
          {this.state.isRegistered ? 'Registered' : 'Unregistered'}
        </button>
      </React.Fragment>
    )
  }
}

export default Register
