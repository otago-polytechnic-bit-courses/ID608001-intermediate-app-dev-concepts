import React, { useState, useEffect } from 'react'
import Modal from './components/Modal'
import axios from 'axios'

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false)
  const [activeItem, setActiveItem] = useState({
    title: '',
    description: '',
    completed: false,
    modal: false
  })
  const [todoList, setTodoList] = useState([])

  useEffect(() => {
    refreshList()
  }, [])


  /* Called each time an API request is completed. It updates the Todo 
  list to display the most recent list of added items */
  const refreshList = () => {
    axios
      .get('http://localhost:8000/api/todos/')
      .then(res => setTodoList(res.data))
      .catch(err => console.log(err))
  }

  const displayCompleted = status => {
    if (status) {
      return setViewCompleted(true)
    }
    return setViewCompleted(false)
  }

  /* Renders two spans which help control which set of items are displayed i.e clicking 
  on the completed tab shows completed tasks and the same for the incomplete tab */
  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? 'active' : ''}
        >
          complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? '' : 'active'}
        >
          Incomplete
        </span>
      </div>
    )
  }

  const renderItems = () => {
    const newItems = todoList.filter(item => item.completed === viewCompleted)
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? 'completed-todo' : ''}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button onClick={handleDelete(item)} className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ))
  }

  const toggle = () => setActiveItem({ modal: !activeItem.modal })

  // Handles both create and update operations
  const handleSubmit = item => {
    toggle()
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then(res => refreshList())
        .catch(err => console.log(err))
      return
    }
    axios
      .post('http://localhost:8000/api/todos/', item)
      .then(res => refreshList())
      .catch(err => console.log(err))
  }

  // Handles delete operation
  const handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then(res => refreshList())
      .catch(err => console.log(err))
  }

  const createItem = () => {
    setActiveItem({
      title: '',
      description: '',
      completed: false,
      modal: !activeItem.modal
    })
  }

  const editItem = item => {
    setActiveItem({ ...item, modal: !activeItem.modal })
  }

  return (
    <div className="content">
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {activeItem.modal ? (
        <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />
      ) : null}
    </div>
  )
}

export default App
