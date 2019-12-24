/**
 * @description 项目空间 - 标签搜索
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import TagSearch from './tag-search'


export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space">
          <Switch>
            <Route exact path="/" component={TagSearch} />
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
