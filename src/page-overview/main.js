/**
 * @description 总览
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router,
} from 'react-router-dom'

import * as navListMap from '../common/navList'
import Frame from '../frame'
import {OverviewCardWrap} from '../component'
import Cloud from './cloud'
import TagRank from './tag-rank'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.overview,
]

@observer
export default class Overview extends Component {
  componentDidMount() {
    store.getCardInfo()
  }

  render() {
    const {cardInfo} = store

    const cards = [
      {
        title: '实体总数',
        tooltipText: '已经发布的实体总数',
        values: [cardInfo.entityCount || 0],
      }, {
        title: '关系总数',
        tooltipText: '已经发布的关系总数',
        values: [cardInfo.relCount || 0],
      }, {
        title: '标签总数',
        tooltipText: '租户级别，公开的标签总数',
        values: [cardInfo.tagCount || 0],
      }, {
        title: '项目总数',
        tooltipText: '关于标签中心的项目总数',
        values: [cardInfo.projectCount || 0],
      },
    ]
    return (
      <Router>
        <Frame navList={navList} productCode="stream" theme="ocean" logoText="数据开发" showAllProduct showSider showHeaderNav>
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
