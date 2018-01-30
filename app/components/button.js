import React from 'react'

class Button extends React.Component {
  render() {
    return <button onClick={this.props.onClick}> Open Dir </button>
  }
}

export default Button
