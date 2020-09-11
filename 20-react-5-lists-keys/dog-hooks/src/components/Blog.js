import React from 'react'

const Blog = (props) => {
  const content = props.posts.map((post) => (
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ))
  return <div>{content}</div>
}

export default Blog
