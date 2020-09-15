import React from 'react'
import Book from './Book'
import Clock from './Clock'
import LoginControl from './LoginControl'
import NumberList from './NumberList'
import Owner from './Owner'
import Register from './Register'
import afghanHoundImg from '../img/afghan-hound.jpg'

const App = () => {
  const dog = {
    name: 'Bingo',
    breed: 'Afghan Hound',
    img: afghanHoundImg,
  }

  const numbers = [1, 2, 3, 4, 5]

  const books = [
    { id: 1, title: 'Gone With The Wind', content: 'Gone with the Wind is a novel by American author Margaret Mitchell.' },
    { id: 2, title: 'The Great Gatsby', content: 'The Great Gatsby is a novel by American author F. Scott Fitzgerald.' },
  ]

  const formatDog = (dog) =>
    `Woof woof, my name is ${dog.name} & my breed is an ${dog.breed}`

  const getGreeting = (dog) => {
    if (dog) {
      return <h1>{formatDog(dog)}</h1>
    }
    return <h1>Uh...who are you?</h1>
  } 
  
  return (
    <div className='main-container'>
      <Owner />
      <Register />
      {getGreeting()}
      <img src={dog.img} alt='afghan hound' width='300' />
      <Clock />
      <LoginControl />
      <NumberList numbers={numbers} />
      <Book books={books} />
    </div>
  )
}

export default App
