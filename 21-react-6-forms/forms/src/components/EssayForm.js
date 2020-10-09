import React, { useState } from 'react'

const EssayForm = () => {
  const [value, setValue] = useState(
    'Please write an essay about your favorite DOM element.'
  )

  const handleChange = (e) => setValue(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`An essay was submitted: ${value}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Essay:
        <textarea value={value} required onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default EssayForm
