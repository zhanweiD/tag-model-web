/**
 * @description 对象模型
 */
import {Component} from 'react'
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom'
import Frame from '../frame'
import ObjectModel from './object-model'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.object,
  navListMap.objectModel,
]

export default class Page extends Component {
  render() {
    return (
      <Router>
        <Frame navList={navList}>
          <Switch>
            <Route path="/" component={ObjectModel} />
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
