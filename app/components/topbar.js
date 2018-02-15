import React from 'react'
import SvgButton from './svg_button'
import folderSvg from '../assets/folder.svg'

class TopBar extends React.Component {
  render() {
    const { onImageBtnClick, onXMLBtnClick } = this.props
    return (
      <div id="topbar">
        <div id="tool-bar">
          <SvgButton svg={folderSvg} onClick={onImageBtnClick}>
            Image
          </SvgButton>
          <SvgButton svg={folderSvg} onClick={onXMLBtnClick}>
            XML
          </SvgButton>
        </div>
      </div>
    )
  }
}

export default TopBar
