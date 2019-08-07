import React from 'react'
import PropTypes from 'prop-types'
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
export default class OverviewCards extends React.Component {
  render() {
    const demoCards = [
      {
        title: 'API数',
        tooltipText: '你猜这是啥',
        values: [12],
        valueTexts: ['API'],
      },
      {
        title: 'EEEE',
        tooltipText: '你猜这是啥',
        values: [42, 14],
        valueTexts: ['API', 'bbbb'],
      },
    ]

    // 一个卡片占据的栅格数
    const colSpan = 24 / (demoCards.length || 1)

    return (
      <div className="white-block p24">
        <Row>
          {
            demoCards.map((data, index) => (
              <Col span={colSpan} style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
                <OverviewCard {...data} />
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}
