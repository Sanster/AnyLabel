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
  },
  listItemSelected: { background: '#e7e7e7' }
})

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props)
  }

  onImgSetClick = imgSetName => {
    this.props.onImgSetClick(imgSetName)
  }

  onImgNameClick = imgIndex => {
    this.props.onImgNameClick(imgIndex)
  }

  render() {
    console.log('render leftsidebar')
    const {
      classes,
      selectImgSet,
      selectImgIndex,
      voc,
      selectImgHeight,
      selectImgWidth,
      selectImgSize
    } = this.props

    let imgNames = null
    let imgSets = null
    if (voc != null && selectImgSet !== '') {
      imgSets = voc.getImgSetNames()
      imgNames = voc.getImgNames(selectImgSet)
    }

    return (
      <SideBar anchor="left">
        <Grid container spacing={0} alignItems="stretch" direction="column">
          <Grid item>
            <List dense subheader={<ListSubheader>Image info</ListSubheader>}>
              <ListItem>
                <ListItemText
                  primary="Size"
                  secondary={`${selectImgWidth}x${selectImgHeight}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="File Size"
                  secondary={`${selectImgSize} KB`}
                />
              </ListItem>
            </List>

            <Divider />
          </Grid>

          {imgNames && (
            <Grid item>
              <List dense className={classes.imgNamesList} subheader={<li />}>
                <ListSubheader>Image names({imgNames.length})</ListSubheader>
                {imgNames.map((name, index) => (
                  <ListItem
                    key={name}
                    button
                    className={
                      index === selectImgIndex ? classes.listItemSelected : ''
                    }
                    onClick={() => this.onImgNameClick(index)}
                  >
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </Grid>
          )}

          {imgSets && (
            <Grid item>
              <List dense>
                <ListSubheader>Image sets({imgSets.length})</ListSubheader>
                {imgSets &&
                  imgSets.map(name => (
                    <ListItem
                      key={name}
                      button
                      className={
                        name === selectImgSet ? classes.listItemSelected : ''
                      }
                      onClick={() => this.onImgSetClick(name)}
                    >
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
              </List>
            </Grid>
          )}
        </Grid>
      </SideBar>
    )
  }
}

LeftSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  selectImgSet: PropTypes.string.isRequired,
  selectImgIndex: PropTypes.number.isRequired,
  selectImgHeight: PropTypes.number.isRequired,
  selectImgWidth: PropTypes.number.isRequired,
  voc: PropTypes.object
}

export default withStyles(styles)(LeftSideBar)
