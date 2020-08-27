import React from 'react'

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date(),
    })
  }

  render() {
    return (
      <div className='container'>
        <h1>Current time: {this.state.date.toLocaleTimeString()}</h1>
      </div>
    )
  }
}

export default Clock
