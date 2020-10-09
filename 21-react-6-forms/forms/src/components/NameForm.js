import React, { useState } from 'react'

const NameForm = () => {
  const [value, setValue] = useState('')

  const handleChange = (e) => setValue(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`A name was submitted: ${value}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} required onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default NameForm
