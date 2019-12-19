/**
 * @description 总览
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router,
} from 'react-router-dom'
import Frame from '../frame'
import {OverviewCardWrap} from '../component'
import Cloud from './cloud'
import TagRank from './tag-rank'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.overview,
]

@observer
export default class Overview extends Component {
  componentWillMount() {

  }

  render() {
    const cards = [
      {
        title: '实体总数',
        tooltipText: '已经发布的实体总数',
        values: [1],
      }, {
        title: '关系总数',
        tooltipText: '已经发布的关系总数',
        values: [2],
      }, {
        title: '标签总数',
        tooltipText: '租户级别，公开的标签总数',
        values: [3],
      }, {
        title: '项目总数',
        tooltipText: '关于标签中心的项目总数(使用中)',
        values: [4],
      },
    ]

    return (
      <Router>
        <Frame navList={navList}>
          <div>
            <div className="content-header">总览</div>
            <div className="page-overview">
              <OverviewCardWrap cards={cards} />
              <Cloud store={store} />
              <TagRank store={store} />
            </div>
          </div>
        </Frame>
      </Router>
    )
  }
}
