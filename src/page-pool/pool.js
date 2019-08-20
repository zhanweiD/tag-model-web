import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'

import Frame from '../frame'
import TaglPool from '../tag'
import TagImport from '../tag-import'
import TagExport from '../tag-export'

@observer
export default class TagRouter extends Component {
  render() {
    return (
      <Router>
        <Frame>
          <Switch>
            <Route exact strict path="/import" component={TagImport} />
            <Route exact strict path="/export" component={TagExport} />
            <Route exact strict path="/:type/:id" component={TaglPool} />
            <Route exact strict path="/:type" component={TaglPool} />
            <Redirect exact from="/" to="/1" />

            <Route
              render={() => {
                window.location.href = '/404'
              }}
            />
          </Switch>
        </Frame>
      </Router>
    )
  }
}
