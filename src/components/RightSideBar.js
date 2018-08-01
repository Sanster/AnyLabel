import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Grid from '@material-ui/core/Grid'

import ListHeader from './base/ListHeader'
import SideBar from './SideBar'
import './LeftSideBar.css'

const styles = theme => ({
  listItemSelected: { background: '#e7e7e7' },
  listItem: {
    paddingTop: 6,
    paddingBottom: 6
  },
  listItemSelected: {
    paddingTop: 6,
    paddingBottom: 6,
    background: '#e7e7e7'
  }
})

class RightSideBar extends React.Component {
  constructor(props) {
    super(props)
  }

  objString(vocObj) {
    const rect = vocObj.rect
    return `${vocObj.name} [${rect.x1},${rect.y1},${rect.width},${rect.height}]`
  }

  onVocObjClick = vocObj => {
    this.props.onVocObjClick(vocObj)
  }

  onKeyDown = event => {
    console.log(event)
    if (event.key === 'Delete') {
      this.props.onDeleteVocObj()
    }
  }

  render() {
    const { vocAnno, selectVocObjId, classes } = this.props
    let vocObjs = null
    let deletedObjCount = 0
    if (vocAnno != null) {
      vocObjs = vocAnno.getObjs()
      deletedObjCount = vocAnno.getDeletedObjCount()
    }

    return (
      <SideBar anchor="right">
        <Grid container spacing={0} alignItems="stretch" direction="column">
          {vocObjs && (
            <Grid item>
              <List dense subheader={<li />}>
                <ListHeader
                  text={`Labels(${vocObjs.length})`}
                  value={deletedObjCount}
                />
                {vocObjs.map((vocObj, index) => (
                  <ListItem
                    key={vocObj.id}
                    button
                    onClick={() => this.onVocObjClick(vocObj)}
                    onKeyDown={event => this.onKeyDown(event)}
                    className={
                      vocObj.id === selectVocObjId
                        ? classes.listItemSelected
                        : classes.listItem
                    }
                  >
                    <ListItemText primary={this.objString(vocObj)} />
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

export default withStyles(styles)(RightSideBar)
