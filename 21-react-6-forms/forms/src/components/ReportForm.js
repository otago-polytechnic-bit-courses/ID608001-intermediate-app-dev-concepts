import React, { useRef } from 'react'

const ReportForm = () => {
  const input = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`A report was submitted: ${input.current.value}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={input} required />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default ReportForm
