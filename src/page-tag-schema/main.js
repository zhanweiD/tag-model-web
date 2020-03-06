/**
 * @description 项目空间 - 标签仓库
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import SchemaList from './schema-list'
import SchemaDetail from './schema-detail'


export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space">
          <Switch>
            <Route exact path="/" component={SchemaList} />
            <Route exact path="/detail/:id" component={SchemaDetail} />
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
