import React from 'react'
import Canvas from './components/canvas'
import Button from './components/button'
import Local from './libs/local'

class App extends React.Component {
  test() {
    Local.openDir(path => {
      console.log(path)
    })
  }

  render() {
    return (
      <div className="App">
        <Button onClick={this.test} />
        <Canvas />
      </div>
    )
  }
}

export default App
