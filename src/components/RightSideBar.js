import React from 'react'
import SideBar from './SideBar'
import './LeftSideBar.css'

class RightSideBar extends React.Component {
  render() {
    return (
      <SideBar anchor="right">
        <div className="right-sidebar-content" />
      </SideBar>
    )
  }
}

export default RightSideBar
