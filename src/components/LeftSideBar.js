import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import TablePagination from '@material-ui/core/TablePagination'
import Grid from '@material-ui/core/Grid'
import SideBar from './SideBar'
import './LeftSideBar.css'

const styles = theme => ({
  root: {
    // height: 960
  },
  imgNamesList: {
    width: '100%',
    overflow: 'auto',
    width: 240,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    minHeight: 350
  },
  imgSetsList: {
    backgroundColor: theme.palette.background.paper,
    width: 240,
    overflow: 'auto',
    height: '100%'
  },
  listItem: {
    paddingTop: 6,
    paddingBottom: 6
  },
  listItemSelected: {
    paddingTop: 6,
    paddingBottom: 6,
    background: '#e7e7e7'
  },
  listTitle: {
    lineHeight: '36px'
  },
  pagination: {
    minHeight: '32px',
    height: '32px'
  }
})

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      rowsPerPage: 10
    }
  }

  onImgSetClick = imgSetName => {
    this.props.onImgSetClick(imgSetName)
  }

  onImgNameClick = imgIndex => {
    this.props.onImgNameClick(imgIndex)
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
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

    const { rowsPerPage, page } = this.state

    let imgNames = null
    let imgSets = null
    if (voc != null && selectImgSet !== '') {
      imgSets = voc.getImgSetNames()
      imgNames = voc.getImgNames(selectImgSet)
    }

    return (
      <SideBar anchor="left">
        <Grid
          container
          spacing={0}
          alignItems="stretch"
          direction="column"
          className={classes.root}
        >
          <Grid item>
            <List dense disablePadding>
              <ListSubheader className={classes.listTitle}>
                Image info
              </ListSubheader>
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
              <List
                dense
                disablePadding
                className={classes.imgNamesList}
                subheader={<li />}
              >
                <ListSubheader className={classes.listTitle}>
                  Image names
                </ListSubheader>
                {imgNames
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((name, index) => (
                    <ListItem
                      key={name}
                      button
                      className={
                        index === selectImgIndex
                          ? classes.listItemSelected
                          : classes.listItem
                      }
                      onClick={() => this.onImgNameClick(index)}
                    >
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
              </List>
              <Divider />
              <TablePagination
                component="div"
                count={imgNames.length}
                rowsPerPage={rowsPerPage}
                classes={{
                  toolbar: classes.pagination
                }}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page'
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page'
                }}
                rowsPerPageOptions={rowsPerPage}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              <Divider />
            </Grid>
          )}

          {imgSets && (
            <Grid item>
              <List dense disablePadding className={classes.imgSetsList}>
                <ListSubheader className={classes.listTitle}>
                  Image sets
                </ListSubheader>
                {imgSets &&
                  imgSets.map(name => (
                    <ListItem
                      key={name}
                      button
                      className={
                        name === selectImgSet
                          ? classes.listItemSelected
                          : classes.listItem
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
