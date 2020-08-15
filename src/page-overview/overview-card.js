import {Component} from 'react'
import QuestionTooltip from '../component/question-tooltip'

export default class OverviewCard extends Component {
  render() {
    const {cardInfo} = this.store
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
      {
        // return (
        //   <div className="mb16" style={{color: 'inherit'}}>
        //     <div className="df-js">
        //       {/* ml4 mt1 对齐微调 */}
        //       <span className="ml4 mt1">
        //         {title}
        //       </span>
        //       <QuestionTooltip tip={tooltipText} />
        //     </div>
        //     <div>
                
        //     </div>
        //   </div>
        // )
      }
    )
  }
}
// export default new OverviewCard()
