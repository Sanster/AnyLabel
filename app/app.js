import React from 'react'
import Canvas from './components/canvas'
import Button from './components/button'
import Local from './libs/local'
import Logger from './libs/logger'
const VocDb = remote.require('./main_thread/vocdb')
// import VocDb from './main_thread/vocdb'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.count = 0
        this.vocdb = null
        this.setName = 'trainval'

        this.state = {
            count: 0,
            index: 0
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
                this.show(0)
            })
        })
    }

    show(index) {
        this.setState({ index: index })
    }

    showNext() {
        const index = this.state.index
        if (index - 1 >= 0) {
            this.show(index - 1)
        }
    }

    showPrev() {
        const index = this.state.index
        if (index + 1 < this.vocdb.getImSetCount(this.setName)) {
            this.show(index + 1)
        }
    }

    render() {
        const { index } = this.state
        let imPath = ''
        let anno = null
        if (this.vocdb != null) {
            imPath = this.vocdb.getImPath(this.setName, index)
            anno = this.vocdb.getAnno(this.setName, index)
        }

        return (
            <div className="App">
                <Button onClick={() => this.chooseVOCDir()}> Open dir </Button>
                <Button onClick={() => this.showNext()}> Prev </Button>
                <Button onClick={() => this.showPrev()}> Next </Button>
                <Canvas bg={imPath} anno={anno} />
            </div>
        )
    }
}

export default App
