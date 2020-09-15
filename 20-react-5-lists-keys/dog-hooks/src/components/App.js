import React from 'react'
// import Blog from './Blog'
import Clock from './Clock'
import LoginControl from './LoginControl'
import Owner from './Owner'
import Register from './Register'
import afghanHoundImg from '../img/afghan-hound.jpg'
import NumberList from './NumberList'

const App = () => {
  const dog = {
    name: 'Bingo',
    breed: 'Afghan Hound',
    img: afghanHoundImg,
  }

  const numbers = [1, 2, 3, 4, 5]

  // const posts = [
  //   { id: 1, title: 'Hello World', content: 'Welcome to learning React!' },
  //   { id: 2, title: 'Installation', content: 'You can install React from npm.' },
  // ]

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
      {/* <Blog posts={posts} /> */}
    </div>
  )
}

export default App
