/**
 * @description 标签模型
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import TagList from './tag-list'
import TagDetail from './tag-detail'

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" pageUrl="/">
          <Switch>
            <Route exact path="/tag-model/:tagId" component={TagDetail} />
            <Route exact path="/tag-model" component={TagList} />
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
