import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import Clock from './components/Clock'
import Owner from './components/Owner'

ReactDOM.render(
  <React.StrictMode>
    <Owner />
    <App />
    <Clock />
  </React.StrictMode>,
  document.getElementById('root')
)
