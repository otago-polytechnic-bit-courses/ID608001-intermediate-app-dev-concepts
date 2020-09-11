import React from 'react'
import Clock from './Clock'
import LoginControl from './LoginControl'
import Owner from './Owner'
import Register from './Register'
import afghanHoundImg from '../img/afghan-hound.jpg'

const dog = {
  name: 'Bingo',
  breed: 'Afghan Hound',
  img: afghanHoundImg
}

const formatDog = (dog) => `Woof woof, my name is ${dog.name} & my breed is an ${dog.breed}`

const getGreeting = (dog) => {
  if (dog) {
    return <h1>{formatDog(dog)}</h1>
  }
  return <h1>Uh...who are you?</h1>
}

const App = () => {
  return (
    <div className='container'>
      <Owner />
      <Register />
      {getGreeting()}
      <img src={dog.img} alt='afghan hound' width='300' />
      <Clock />
      <LoginControl />
    </div>
  )
}

export default App
