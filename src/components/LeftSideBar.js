import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Grid from '@material-ui/core/Grid'
import SideBar from './SideBar'
import './LeftSideBar.css'

const styles = theme => ({
  imgNamesList: {
    width: '100%',
    maxWidth: 360,
    position: 'relative',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    maxHeight: 300
  }
})

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSets: ['train', 'val', 'test'],
      imgNames: [
        'img_1.jpg',
        'img_2.jpg',
        'img_3.jpg',
        'img_4.jpg',
        'img_5.jpg',
        'img_6.jpg',
        'img_7.jpg',
        'img_8.jpg',
        'img_9.jpg',
        'img_13.jpg',
        'img_23.jpg',
        'img_33.jpg',
        'img_43.jpg',
        'img_53.jpg'
      ]
    }
  }

  render() {
    const { imgSets, imgNames } = this.state
    const { classes } = this.props

    return (
      <SideBar anchor="left">
        <Grid
          container
          spacing={0}
          alignItems="stretch"
          direction="column"
          className={{ flexGrow: 1 }}
        >
          <Grid item>
            <List dense subheader={<ListSubheader>Image info</ListSubheader>}>
              <ListItem>
                <ListItemText primary="Size" secondary="1024 x 687" />
              </ListItem>
              <ListItem>
                <ListItemText primary="File Size" secondary="3.0mb" />
              </ListItem>
            </List>

            <Divider />
          </Grid>

          <Grid item>
            <List dense className={classes.imgNamesList} subheader={<li />}>
              <ListSubheader>Images name</ListSubheader>
              {imgNames.map(name => (
                <ListItem key={name} button>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Grid>

          <Grid item>
            <List dense subheader={<ListSubheader>Images sets</ListSubheader>}>
              {imgSets.map(name => (
                <ListItem key={name} button>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </SideBar>
    )
  }
}

LeftSideBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LeftSideBar)
