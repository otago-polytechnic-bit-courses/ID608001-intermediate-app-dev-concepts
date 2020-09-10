import React, { useState, useEffect } from 'react'

function Clock() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const intervalID = setInterval(() => tick(), 1000)
    return () => clearInterval(intervalID)
  }, [])

  function tick() {
    return setDate(new Date())
  }

  return <h1>Current time: {date.toLocaleTimeString()}</h1>
}

export default Clock
