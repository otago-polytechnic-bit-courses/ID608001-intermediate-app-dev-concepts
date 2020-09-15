import React, { useState, useEffect } from 'react'

const Clock = () => {
  const [date, setDate] = useState(new Date())

  const tick = () => setDate(new Date())

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID) // Cleanup
  }, [])

  return <h1>Current time: {date.toLocaleTimeString()}</h1>
}

export default Clock 
