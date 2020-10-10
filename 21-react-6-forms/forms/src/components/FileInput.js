import React, { useRef } from 'react'

const FileInput = () => {
  const fileInput = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Selected file - ${fileInput.current.files[0].name}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" ref={fileInput} />
      </label>
      <br />
      <input type="submit">Submit</input>
    </form>
  )
}

export default FileInput
