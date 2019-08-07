import React from 'react'
import PropTypes from 'prop-types'
import {
  Tabs, Row, Col, Table,
} from 'antd'
import DateSelect from '../component-date-select'
import LineChart from '../component-line-chart'

const {TabPane} = Tabs

const tableColumns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
    render: (v, record, index) => index + 1,
  },
  {
    title: '标签名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '标签价值分',
    dataIndex: 'score',
    key: 'score',
    width: 80,
    sorter: true,
  },
]

const tableData = [
  {
    name: 'hhh',
    score: 10,
  },
]

/**
 * @description 标签概览 - 标签价值、热度、质量的折线图和排名
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class OverviewScore
 * @extends {React.Component}
 */
export default class OverviewScore extends React.Component {
  render() {
    return (
      <div className="white-block mt16 pt16">
        <Tabs
          tabBarExtraContent={<DateSelect />}
          tabBarStyle={{padding: '0 24px', marginBottom: '0'}}
        >
          <TabPane tab="标签价值" key="worth">
            <Row gutter={48} style={{height: '400px', padding: '16px 24px 24px 24px'}}>
              <Col span={15}>
                {/* 标签价值 */}
                <LineChart height={360} />
              </Col>
              <Col span={9}>
                <div className="fs14 mb12">标签价值分Top20排名</div>
                <Table
                  dataSource={tableData}
                  columns={tableColumns}
                  pagination={{
                    current: 1,
                    pageSize: 5,
                    total: Math.min(10, 20),
                  }}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="标签热度" key="hot">
            标签价值
          </TabPane>
          <TabPane tab="标签质量" key="quality">
            标签价值
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
