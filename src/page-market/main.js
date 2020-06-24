/**
 * @description 集市
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import * as navListMap from '../common/navList'

import Frame from '../frame'
import Market from './market'

import './main.styl'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const navList = [
  navListMap.tagCenter,
  navListMap.market,
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" navList={navList} roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact path="/market" component={Market} />
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
