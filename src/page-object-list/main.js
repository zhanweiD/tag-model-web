/**
 * @description 对象管理
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import ObjectList from './object-list'
import ObjectDetail from './object-detail'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.object,
  {text: navListMap.objectList.text},
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame navList={navList}>
          <Switch>
            <Route exact strict path="/detail/:typeCode/:objId" component={ObjectDetail} />
            <Route path="/" component={ObjectList} />
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
