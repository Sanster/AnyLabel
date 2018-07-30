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
  listItemSelected: { background: '#e7e7e7' },
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

  onVocObjClick = vocObjIndex => {
    this.props.onVocObjClick(vocObjIndex)
  }

  render() {
    const { vocAnno, selectVocObjIndex, classes } = this.props
    let vocObjs = null
    if (vocAnno != null) {
      vocObjs = vocAnno.objs
    }

    return (
      <SideBar anchor="right">
        <Grid container spacing={0} alignItems="stretch" direction="column">
          {vocObjs && (
            <Grid item>
              <List dense subheader={<li />}>
                <ListSubheader className={classes.listTitle}>
                  Labels({vocObjs.length})
                </ListSubheader>
                {vocObjs.map((vocObj, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => this.onVocObjClick(index)}
                    className={
                      index === selectVocObjIndex
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
