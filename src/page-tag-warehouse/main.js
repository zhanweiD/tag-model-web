/**
 * @description  标签仓库
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import TagWarehouse from './tag-warehouse'
import TagDetail from './detail'


export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" productCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact path="/tag-warehouse" component={TagWarehouse} />
            <Route exact path="/tag-warehouse/:id" component={TagDetail} />
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
