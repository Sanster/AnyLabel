import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './test_app'

ReactDOM.render(<App />, document.getElementById('root'))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
