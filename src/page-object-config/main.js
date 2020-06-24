/**
 * @description 对象配置
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import * as navListMap from '../common/navList'

import Frame from '../frame'
import ObjectConfig from './object-config'

import './main.styl'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const navList = [
  navListMap.tagCenter,
  navListMap.tagManagement,
  navListMap.objectConfig,
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame page="space" navList={navList} roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav showProject>
          <Switch>
            <Route exact path="/object-config/:typeCode?/:objId?/:tabId?" component={ObjectConfig} />
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
