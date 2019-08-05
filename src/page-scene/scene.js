import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import Frame from '../frame'
import Scene from '../scene'
import SceneDetail from '../scene-detail'
import SceneTags from '../scene-tags'

@observer
export default class SceneRouter extends Component {
  render() {
    return (
      <Router>
        <Frame>
          <Switch>
            <Route exact strict path="/" component={Scene} />
            <Route exact strict path="/detail" component={SceneDetail} />
            <Route exact strict path="/tags" component={SceneTags} />
          </Switch>
        </Frame>
      </Router>
    )
  }
}
