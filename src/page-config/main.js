import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import Frame from '../frame'
import WorkspaceConfig from './workspace-config'

@observer
export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" productCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact path="/workspace-config" component={WorkspaceConfig} />
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
