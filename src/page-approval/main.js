import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import * as navListMap from '../common/navList'

import Frame from '../frame'
import Approval from './approval'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const navList = [
  navListMap.tagCenter,
  navListMap.common,
  {text: navListMap.approval.text},
]

export default class Main extends Component {
  render() {
    return (
      <Router>
        <Frame navList={navList}>
          <Switch>
            <Route exact path="/approval/:type?" component={Approval} />
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
