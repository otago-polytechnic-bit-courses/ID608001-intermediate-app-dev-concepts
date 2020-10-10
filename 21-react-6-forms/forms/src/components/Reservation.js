import React, { useState } from 'react'

const Reservation = () => {
  const [state, setState] = useState({
    name: '',
    numOfGuests: 0
  })

  const handleInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(
      `${state.name} + ${state.numOfGuests} have made a reservation`
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          name="name"
          type="text"
          required
          value={state.name}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Number of guests:
        <input
          name="numOfGuests"
          type="number"
          min="0"
          max="5"
          required
          value={state.numOfGuests}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  )
}

export default Reservation
