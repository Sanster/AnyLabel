import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import './TopBar.css'

const electron = window.require('electron')
const dialog = electron.remote.dialog

class TopBar extends React.Component {
  render() {
    return (
      <div id="topbar">
        <Toolbar>
          <div id="tool-bar" />
        </Toolbar>
      </div>
    )
  }
}

TopBar.propTypes = {}

export default TopBar
