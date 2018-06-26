import React from 'react'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Grid from '@material-ui/core/Grid'
import SideBar from './SideBar'
import './LeftSideBar.css'

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSets: ['train', 'val', 'test'],
      imgNames: [
        'img_1.jpg',
        'img_2.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg',
        'img_3.jpg'
      ]
    }
  }

  render() {
    const { imgSets, imgNames } = this.state

    return (
      <SideBar anchor="left">
        <Grid
          xs={12}
          container
          spacing={0}
          alignItems="stretch"
          direction="column"
          className={{ flexGrow: 1 }}
        >
          <Grid item>
            <List
              component="nav"
              dense
              subheader={<ListSubheader>Image info</ListSubheader>}
            >
              <ListItem>
                <ListItemText primary="Size" secondary="1024 x 687" />
              </ListItem>
              <ListItem>
                <ListItemText primary="File Size" secondary="3.0mb" />
              </ListItem>
            </List>

            <Divider />
          </Grid>

          <Grid item lg={6} className={{ overflow: 'auto' }}>
            <List
              component="nav"
              dense
              subheader={<ListSubheader>Images name</ListSubheader>}
            >
              {imgNames.map(name => (
                <ListItem key={name} button>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Grid>

          <Grid item>
            <List
              component="nav"
              dense
              subheader={<ListSubheader>Images sets</ListSubheader>}
            >
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

export default LeftSideBar
