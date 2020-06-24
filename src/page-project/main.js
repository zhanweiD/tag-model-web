import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import Frame from '../frame'
import ProjectList from './project-list'
import ProjectConfig from './project-config'

@observer
export default class Project extends Component {
  render() {
    return (
      <Router>
        <Frame roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav>
          <Switch>
            <Route exact path="/project/:projectId" component={ProjectConfig} />
            <Route exact path="/project" component={ProjectList} />
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
