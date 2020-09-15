import React, { useState } from 'react'

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(true)

  const handleRegisteredChange = () => setIsRegistered(!isRegistered)

  return (
    <button onClick={handleRegisteredChange}>
      {isRegistered ? 'Registered' : 'Unregistered'}
    </button>
  )
}

export default Register
