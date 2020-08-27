import React from 'react'
import afghanHoundImg from '../img/afghan-hound.jpg'

const dog = {
  name: 'Bingo',
  breed: 'Afghan Hound',
  img: afghanHoundImg,
}

function formatDog(dog) {
  return `${dog.name} & my breed is an ${dog.breed}` // Alternative: dog.name + ' & my breed is an ' + dog.breed
}

function getGreeting(dog) {
  if (dog) {
    return <h1>Woof woof, my name is {formatDog(dog)}</h1>
  }
  return <h1>Uh...who are you?</h1>
}

function App() {
  return (
    <div className='container'>
      {getGreeting()}
      <img src={dog.img} alt='afghan hound' width='300' />
    </div>
  )
}

export default App
