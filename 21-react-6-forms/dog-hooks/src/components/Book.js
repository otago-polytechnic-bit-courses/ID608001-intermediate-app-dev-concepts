import React from 'react'

const Book = (props) => {
  const title = props.books.map((book) => (
    <div key={book.id}>
      <h1>{book.title}</h1>
    </div>
  ))

  const content = props.books.map((book) => (
    <div key={book.id}>
      <p>{book.content}</p>
    </div>
  ))
  
  return (
    <React.Fragment>
      {title}
      {content}
    </React.Fragment>
  )
}

export default Book
