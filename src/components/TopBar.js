import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import './TopBar.css'

const electron = window.require('electron')
const dialog = electron.remote.dialog

class TopBar extends React.Component {
  handleSelectVoc() {
    const selectedDir = dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (selectedDir) {
      console.log(selectedDir)
      //   TODO: check voc valid
      this.props.onVocDirSelected(selectedDir[0])
    }
  }

  render() {
    return (
      <div id="topbar">
        <div id="tool-bar">
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSelectVoc}
          >
            Voc
          </Button>
        </div>
      </div>
    )
  }
}

TopBar.propTypes = {
  onVocDirSelected: PropTypes.func
}

export default TopBar
