import React from 'react'
import { Router } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import HomePage from './containers/HomePage'

const history = createBrowserHistory()

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    )
  }
}

export default App
