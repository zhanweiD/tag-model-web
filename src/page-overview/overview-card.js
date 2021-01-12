import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import QuestionTooltip from '../component/question-tooltip'

@observer
class OverviewCard extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  render() {
    const { cardInfo } = this.store
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
      <div className="view-card box-border">
        <div className="overview-card-header">
          {intl
            .get('ide.src.page-overview.overview-card.dwoezp52np8')
            .d('基础数据')}
        </div>
        <div className="df-js">
          {cards.map((item, index) => {
            return (
              // <div className="one-card" style={{width: '25%', borderRight: index === 3 ? null : '1px solid #f0f0f0'}}>
              <div className="one-card" style={{ width: '25%' }}>
                <div className="df-js">
                  {/* ml4 mt1 对齐微调 */}
                  <div>{item.title}</div>
                  <QuestionTooltip tip={item.tooltipText} />
                </div>
                <div className="f-color">{item.values}</div>
                <div />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
export default OverviewCard
