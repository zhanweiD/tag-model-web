/**
 * @description 总览
 */
import {Component} from 'react'
import {observer} from 'mobx-react'

import {OverviewCardWrap} from '../component'
import Cloud from './cloud'
import TagRank from './tag-rank'
import Distribute from './distribute'
// import Line from './line' 

import store from './store'

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
        tooltipText: '已发布的标签总数',
        values: [cardInfo.tagCount || 0],
      }, {
        title: '项目总数',
        tooltipText: '授权标签中心的项目总数',
        values: [cardInfo.projectCount || 0],
      },
    ]
    return (
      
      <div>
        <div className="content-header">总览</div>
        <div className="page-overview">
          <OverviewCardWrap cards={cards} style={{marginBottom: '16px'}} />
          <Cloud store={store} />
          <Distribute store={store} />
          <TagRank store={store} />
          {/* <Line />  */}
        </div>
      </div>

    )
  }
}
