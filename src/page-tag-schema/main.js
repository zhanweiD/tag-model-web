/**
 * @description  标签仓库
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
            <Route exact path="/tag-schema" component={SchemaList} />
            <Route exact path="/tag-schema/detail/:id" component={SchemaDetail} />
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
