/**
 * @description 对象管理
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import * as navListMap from '../common/navList'

import Frame from '../frame'
import ObjectList from './object-list'
import ObjectDetail from './object-detail'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.object,
  {text: navListMap.objectList.text},
]

const selfUrl = 'object-list'

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame navList={navList} roductCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav>
          <Switch>
            <Route exact path={`/${selfUrl}/detail/:typeCode/:objId`} component={ObjectDetail} />
            <Route exact path={`/${selfUrl}`} component={ObjectList} />
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
