import intl from 'react-intl-universal'
/**
 * @description 总览
 */
import { Component } from 'react'
import { observer } from 'mobx-react'

import { OverviewCardWrap } from '../component'
import Cloud from './cloud'
import TagRank from './tag-rank'
import Distribute from './distribute'
import OverviewCard from './overview-card'
// import Line from './line'

import store from './store'

@observer
class Overview extends Component {
  componentDidMount() {
    store.getCardInfo()
  }

  render() {
    const { cardInfo } = store

    const cards = [
      {
        title: intl
          .get('ide.src.page-overview.overview-card.hgz5da0c39w')
          .d('实体总数'),
        tooltipText: intl
          .get('ide.src.page-overview.overview-card.an9demw8kea')
          .d('已经发布的实体总数'),
        values: [cardInfo.entityCount || 0],
      },
      {
        title: intl
          .get('ide.src.page-overview.overview-card.9mt20zw5pum')
          .d('关系总数'),
        tooltipText: intl
          .get('ide.src.page-overview.overview-card.96umvipy52w')
          .d('已经发布的关系总数'),
        values: [cardInfo.relCount || 0],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.oq3u9e6e36')
          .d('标签总数'),
        tooltipText: intl
          .get('ide.src.page-manage.page-object-model.detail.jjhghyku4sk')
          .d('已发布的标签总数'),
        values: [cardInfo.tagCount || 0],
      },
      {
        title: intl
          .get('ide.src.page-overview.overview-card.j85uwoylf18')
          .d('项目总数'),
        tooltipText: intl
          .get('ide.src.page-overview.overview-card.9ljmmozjrr')
          .d('授权标签中心的项目总数'),
        values: [cardInfo.projectCount || 0],
      },
    ]

    return (
      <div>
        <div className="content-header">
          {intl.get('ide.src.common.navList.ftbdjpmt406').d('总览')}
        </div>
        <div className="page-overview">
          {/* <OverviewCardWrap cards={cards} style={{marginBottom: '16px'}} /> */}
          <OverviewCard store={store} />
          <Cloud store={store} />
          <Distribute store={store} />
          <TagRank store={store} />
          {/* <Line />  */}
        </div>
      </div>
    )
  }
}
export default Overview
