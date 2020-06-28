import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import SceneList from './scene'
import SceneDetail from './scene-detail'
import TagList from './tag-list'

import Frame from '../frame'

@observer
export default class Scene extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" pageUrl="/scene" productCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact path="/scene" component={SceneList} />
            <Route exact path="/scene/:sceneId" component={SceneDetail} /> 
            <Route exact strict path="/scene/:sceneId/tags" component={TagList} />
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
