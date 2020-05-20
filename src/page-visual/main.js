import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import VisualList from './visual-list'
import VisualDetail from './visual-detail'
import VisualConfig from './visual-config'
import TagList from './tag-list'

@observer
export default class TagVisual extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" pageUrl="/visual">
          <Switch>
            <Route exact strict path="/visual" component={VisualList} />
            <Route exact strict path="/visual/detail/:id" component={VisualDetail} />
            <Route exact strict path="/visual/config/:id?" component={VisualConfig} />
            <Route exact strict path="/visual/tags/:id?" component={TagList} />
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
