import React from 'react'
import Blog from './Blog'
import Clock from './Clock'
import ListsKeys from './ListsKeys'
import LoginControl from './LoginControl'
import Owner from './Owner'
import Register from './Register'
import afghanHoundImg from '../img/afghan-hound.jpg'

const dog = {
  name: 'Bingo',
  breed: 'Afghan Hound',
  img: afghanHoundImg,
}

const numbers = [1, 2, 3, 4, 5]

const posts = [
  { id: 1, title: 'Hello World', content: 'Welcome to learning React!' },
  { id: 2, title: 'Installation', content: 'You can install React from npm.' },
]

function formatDog(dog) {
  return `Woof woof, my name is ${dog.name} & my breed is an ${dog.breed}`
}

function getGreeting(dog) {
  if (dog) {
    return <h1>{formatDog(dog)}</h1>
  }
  return <h1>Uh...who are you?</h1>
}

function App() {
  return (
    <div className='container'>
      <Owner />
      <Register />
      {getGreeting()}
      <img src={dog.img} alt='afghan hound' width='300' />
      <Clock />
      <LoginControl />
      <ListsKeys numbers={numbers} />
      <Blog posts={posts} />
    </div>
  )
}

export default App
