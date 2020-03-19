/**
 * @description 项目空间 - 标签仓库
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import TagWarehouse from './tag-warehouse'


export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space">
          <Switch>
            <Route exact path="/tag-warehouse" component={TagWarehouse} />
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
