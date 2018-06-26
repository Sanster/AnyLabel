import React from 'react'
import SideBar from './SideBar'
import './LeftSideBar.css'

class LeftSideBar extends React.Component {
  render() {
    return (
      <SideBar anchor="left">
        <div className="left-sidebar-content" />
      </SideBar>
    )
  }
}

export default LeftSideBar
