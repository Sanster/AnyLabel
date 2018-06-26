import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles'

const drawerWidth = 240

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar
})

class SideBar extends React.Component {
  render() {
    const { classes, anchor } = this.props

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor={anchor}
      >
        {/* For Margin top */}
        <div className={classes.toolbar} />
        {this.props.children}
      </Drawer>
    )
  }
}

export default withStyles(styles)(SideBar)
