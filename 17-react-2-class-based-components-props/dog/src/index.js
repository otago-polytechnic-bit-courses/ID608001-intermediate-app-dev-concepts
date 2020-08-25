import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import Owner from './components/Owner'

ReactDOM.render(
  <React.StrictMode>
    <Owner name='Jane Doe' />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
