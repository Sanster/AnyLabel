import React from 'react'

class SvgButton extends React.Component {
  render() {
    const { children, svg, ...other } = this.props
    return (
      <div className="svg-button" {...other}>
        <img src={svg} />
        <div>{children}</div>
      </div>
    )
  }
}

export default SvgButton
