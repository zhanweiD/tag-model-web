/**
 * @description 对象模型
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import * as navListMap from '../common/navList'

import Frame from '../frame'
import ObjectModel from './object-model'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

// const navList = [
//   navListMap.tagCenter,
//   navListMap.object,
//   navListMap.objectModel,
// ]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame productCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav>
          <Switch>
            <Route path="/object-model/:typeCode?/:objId?/:tabId?" component={ObjectModel} />
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
