import React, { Component } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

class DeleteDialog extends React.Component {
  constructor(props) {
    super(props)
  }

  handleCancel = () => {
    this.props.onClose(false)
  }

  handleOk = () => {
    this.props.onClose(true)
  }

  render() {
    const { ...other } = this.props

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Delete</DialogTitle>
        <DialogContent>Confirm delete item?</DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DeleteDialog
