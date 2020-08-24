import React from 'react'
import afghanHoundImg from './img/afghan-hound.jpg'
import './App.css'

const dog = {
  name: 'Bingo',
  breed: 'Afghan Hound',
  age: 5,
  img: afghanHoundImg,
}

function formatDog(dog) {
  return `${dog.name} & my breed is an ${dog.breed}`
}

function getGreeting(dog) {
  if (dog) {
    return <h1>Woof woof, my name is {formatDog(dog)}</h1>
  }
  return <h1>Uh...who are you?</h1>
}

// React.createElement(
//   'div',
//   {
//     className: 'App',
//   },
//   getGreeting(),
//   React.createElement('img', {
//     src: dog.img,
//     alt: 'afghan hound',
//     width: '300',
//   })
// )

function App() {
  return (
    <div className='App'>
      {getGreeting()}
      <img src={dog.img} alt='afghan hound' width='300' />
    </div>
  )
}

export default App
