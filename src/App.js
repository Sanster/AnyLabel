import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Button from '@material-ui/core/Button'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to AnyLabel</h1>
        </header>
        <Button variant="contained" color="primary">
          VOC2007
        </Button>
      </div>
    )
  }
}

export default App
