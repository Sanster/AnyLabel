import React from 'react'
import Canvas from './components/canvas'
import Button from './components/button'
import Local from './libs/local'
import Logger from './libs/logger'
const VocDb = electron.require('./main_thread/vocdb')

class App extends React.Component {
    constructor(props) {
        super(props)
        this.count = 0
        this.vocdb = null

        this.state = {
            count: 0,
            index: -1
        }
    }

    componentDidMount() {
        this.workingDir = '/Users/cwq/Documents/bioack/facenet/lfw/raw'
    }

    updateCount() {
        this.setState({ count: this.count })
    }

    chooseVOCDir() {
        Local.openDir(path => {
            this.vocdb = new VocDb(path)
            this.vocdb.load(() => {
                Logger.debug("Voc Data Load finish")
                this.showNext()
            })
        })
    }

    showNext() {
        const index = this.state.index
        this.setState({ index: index + 1 })
    }

    showPrev() {
        const index = this.state.index
        this.setState({ index: index - 1 })
    }

    render() {
        const { index } = this.state
        let imPath = ''
        if (this.vocdb != null) {
            imPath = this.vocdb.getImPath('trainval', index)
        }

        return (
            <div className="App">
                <Button onClick={() => this.chooseVOCDir()}> Open dir </Button>
                <Button onClick={() => this.showNext()}> Prev </Button>
                <Button onClick={() => this.showPrev()}> Next </Button>
                <h4>{this.state.count}</h4>
                <Canvas bg={imPath} />
            </div>
        )
    }
}

export default App
