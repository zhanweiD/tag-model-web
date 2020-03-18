/**
 * @description  对象配置
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import Frame from '../frame'
import Market from './market'

import './main.styl'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.market,
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" navList={navList}>
          <Switch>
            <Route exact path="/" component={Market} />
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
