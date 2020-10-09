import React, { useState } from 'react'

const Reservation = () => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    numOfGuests: 0
  })

  const handleInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(
      `${state.firstName} ${state.lastName} + ${state.numOfGuests} has made a reservation`
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          name="firstName"
          type="text"
          required
          value={state.firstName}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          name="lastName"
          type="text"
          required
          value={state.lastName}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Number of guests:
        <input
          name="numberOfGuests"
          type="number"
          min="0"
          max="5"
          required
          value={state.numberOfGuests}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  )
}

export default Reservation
