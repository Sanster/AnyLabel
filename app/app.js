import React from 'react'
import Canvas from './components/canvas'
import Button from './components/button'
import Local from './libs/local'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.count = 0

    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    this.workingDir = '/Users/cwq/Documents/bioack/facenet/lfw/raw'
  }

  updateCount() {
    this.setState({ count: this.count })
  }

  chooseImgDir() {
    Local.openDir(path => {
      Local.walker.readImgFiles(path, filepath => {
        this.count += 1
        if (this.count % 10 == 0) {
          this.updateCount()
        }
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Button onClick={() => this.chooseImgDir()}> Open dir </Button>
        <Button onClick={this.chooseImgDir}> Next </Button>
        <h4>{this.state.count}</h4>
        <Canvas />
      </div>
    )
  }
}

export default App
