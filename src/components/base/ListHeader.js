import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import Badge from '@material-ui/core/Badge'
import { Grid } from '@material-ui/core'

const styles = theme => ({
  listTitle: {
    lineHeight: '36px'
  },
  badgeAdd: {
    top: 6,
    backgroundColor: 'green',
    color: 'white',
    height: 20,
    width: 20
  },
  badgeDelete: {
    top: 6,
    backgroundColor: 'red',
    color: 'white',
    height: 20,
    width: 20
  }
})

class ListHeader extends React.Component {
  getBadge(value, classes) {
    if (value && value !== 0) {
      console.log('lasdjfaskldfjlasdjf!!')
      return (
        <Grid item>
          <Badge badgeContent={value} classes={{ badge: classes }}>
            .
          </Badge>
        </Grid>
      )
    }
  }

  render() {
    const { text, value, classes } = this.props

    let badgeClasses

    // 目前只支持删除，认为 value 是删除了几个
    if (value > 0) {
      badgeClasses = classes.badgeDelete
    } else {
      badgeClasses = classes.badgeAdd
    }

    return (
      <ListSubheader className={classes.listTitle}>
        <Grid
          container
          spacing={0}
          className={classes.root}
          justify="space-between"
        >
          <Grid item>{text}</Grid>
          {this.getBadge(value, badgeClasses)}
        </Grid>
      </ListSubheader>
    )
  }
}

ListHeader.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.number
}

export default withStyles(styles)(ListHeader)
