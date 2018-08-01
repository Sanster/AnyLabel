import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'

const styles = theme => ({
  listTitle: {
    lineHeight: '36px'
  }
})

class ListHeader extends React.Component {
  render() {
    const { text, classes } = this.props
    return <ListSubheader className={classes.listTitle}>{text}</ListSubheader>
  }
}

ListHeader.propTypes = {
  text: PropTypes.object.isRequired
}

export default withStyles(styles)(ListHeader)
