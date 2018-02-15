import React from 'react'

class SvgButton extends React.Component {
  render() {
    const { onClick, children, svg } = this.props
    return (
      <div className="svg-button" onClick={onClick}>
        <img src={svg} />
        <div>{children}</div>
      </div>
    )
  }
}

export default SvgButton
