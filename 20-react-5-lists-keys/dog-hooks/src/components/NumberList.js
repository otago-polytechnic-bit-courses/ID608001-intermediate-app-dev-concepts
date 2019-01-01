import React from 'react'
import ListItem from './ListItem'

function NumberList(props) {
  const numbers = props.numbers
  const listItems = numbers.map((number) => (
    <ListItem key={number.toString()} value={number} />
  ))
  return <ul>{listItems}</ul>
}

export default NumberList
