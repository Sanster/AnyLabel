import React from 'react'
import Button from '@material-ui/core/Button'
import './TopBar.css'

class TopBar extends React.Component {
  render() {
    // const {
    //   onImageBtnClick,
    //   onXMLBtnClick,
    //   onSaveBtnClick,
    //   onBoxBtnClick
    // } = this.props

    return (
      <div id="topbar">
        <div id="tool-bar">
          <Button>Image</Button>
          <Button>XML</Button>
          <Button>Save</Button>
          <Button>Box</Button>
        </div>
      </div>
    )
  }
}

export default TopBar
