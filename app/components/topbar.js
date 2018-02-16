import React from 'react'
import SvgButton from './svg_button'
import folderSvg from '../assets/folder.svg'
import saveSvg from '../assets/save.svg'
import boxSvg from '../assets/box.svg'

class TopBar extends React.Component {
  render() {
    const {
      onImageBtnClick,
      onXMLBtnClick,
      onSaveBtnClick,
      onBoxBtnClick
    } = this.props

    return (
      <div id="topbar">
        <div id="tool-bar">
          <SvgButton svg={folderSvg} onClick={onImageBtnClick}>
            Image
          </SvgButton>
          <SvgButton svg={folderSvg} onClick={onXMLBtnClick}>
            XML
          </SvgButton>
          <SvgButton svg={saveSvg} onClick={onSaveBtnClick} id="save-btn">
            Save
          </SvgButton>
          <SvgButton svg={boxSvg} onClick={onBoxBtnClick}>
            Box
          </SvgButton>
        </div>
      </div>
    )
  }
}

export default TopBar
