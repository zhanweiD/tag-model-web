import React from 'react'
import {observer} from 'mobx-react'
import {Row, Col} from 'antd'
import OverviewCard from '../component-overview-card'

/**
 * @description 标签概览 - 标签数、API数等卡片
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class OverviewCards
 * @extends {React.Component}
 */
@observer
export default class OverviewCards extends React.Component {
  componentDidMount() {
    const {store} = this.props
    store.getCardsData()
  }

  render() {
    const {store} = this.props
    const {
      cardsData: {
        tagCount,
        avgWorth,
        maxWorth,
        avgHot,
        maxHot,
        avgQuality,
        maxQuality,
        apiCount,
        avgInvoke,
        maxInvoke,
      },
    } = store

    const cards = [
      {
        title: '标签数',
        tooltipText: '标签创建数，包括未绑定数据的标签',
        values: [tagCount],
      },
      {
        title: 'API数',
        tooltipText: '调用标签的API数',
        values: [apiCount],
      },
      {
        title: '标签热度',
        tooltipText: '通过标签的调用度反映标签热度',
        values: [avgHot, maxHot],
        valueTexts: ['平均', '最高'],
      },
      {
        title: '标签质量分',
        tooltipText: '通过字段的完整性、规范性反映标签的质量',
        values: [avgQuality, maxQuality],
        valueTexts: ['平均', '最高'],
      },
      {
        title: '标签价值分',
        tooltipText: '由标签的覆盖度、活跃度、鲜活度反映标签价值',
        values: [avgWorth, maxWorth],
        valueTexts: ['平均', '最高'],
      },
      {
        title: '标签调用次数',
        tooltipText: '标签被API调用的次数',
        values: [avgInvoke, maxInvoke],
        valueTexts: ['平均', '最高'],
      },
    ]

    // 一个卡片占据的栅格数
    const colSpan = 24 / (cards.length || 1)

    return (
      <div className="white-block pt24 pb24">
        <Row>
          {
            cards.map((data, index) => (
              <Col span={colSpan} style={{height: 81, borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
                <OverviewCard {...data} />
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}
