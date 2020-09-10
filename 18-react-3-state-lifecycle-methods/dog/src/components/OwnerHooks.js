import React, { useState } from 'react'

function Owner() {
  const [name] = useState('Jane Doe')
  return <h1>My owner is {name}</h1>
}

export default Owner
