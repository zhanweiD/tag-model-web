/**
 * @description 组件模版
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import Frame from '../frame'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper

const navList = [
  navListMap.tagCenter,
  navListMap.overview,
]

@observer
export default class Overview extends Component {
  render() {
    return (
      <Frame navList={navList}>
        <div>page</div>
      </Frame>
    )
  }
}
