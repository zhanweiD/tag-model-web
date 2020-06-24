import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'

import SourceList from './source-list'
import SourceDetail from './source-detail'

@observer
export default class AimSource extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" pageUrl="/aim-source" roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact strict path="/aim-source" component={SourceList} />
            <Route exact strict path="/aim-source/:id" component={SourceDetail} />
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
