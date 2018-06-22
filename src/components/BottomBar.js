import React from 'react'
import PropTypes from 'prop-types'
import Point from '../models/Point'
import './BottomBar.css'

class BottomBar extends React.Component {
  render() {
    const { mousePos } = this.props
    var x = 0
    var y = 0
    if (mousePos !== null) {
      x = mousePos.x
      y = mousePos.y
    }

    if (x < 0) x = 0
    if (y < 0) y = 0

    return (
      <div id="bottom-bar">
        <div className="mouse-pos">
          <div className="label">x:</div>
          <div className="value">{`${x}`.padStart(3)}</div>
        </div>
        <div className="mouse-pos">
          <div className="label">y:</div>
          <div className="value">{`${y}`.padStart(3)}</div>
        </div>
      </div>
    )
  }
}

BottomBar.propTypes = {
  mousePos: PropTypes.instanceOf(Point)
}

export default BottomBar
