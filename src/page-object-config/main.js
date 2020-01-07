/**
 * @description 项目空间 - 对象配置
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'

import Frame from '../frame'
import ObjectConfig from './object-config'

import './main.styl'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.asset,
  navListMap.tagCenter,
  navListMap.space,
  navListMap.objectConfig,
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" navList={navList}>
          <Switch>
            <Route exact path="/:typeCode?/:objId?/:tabId?" component={ObjectConfig} />
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
