import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'

import SyncList from './sync-list'
import SyncDetail from './sync-detail'
// import SyncResult from '../page-sync-result/sync-result'

@observer
export default class TagSync extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" pageUrl="/tag-sync" roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact strict path="/tag-sync" component={SyncList} />
            {/* <Route exact strict path="/tag-sync/result" component={SyncResult} /> */}
            <Route exact strict path="/tag-sync/:id" component={SyncDetail} />
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
