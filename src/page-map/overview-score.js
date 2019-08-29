import React from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Tabs} from 'antd'
import TimeRange from '../time-range'
import OverviewScorePanel from './overview-score-panel'

const {TabPane} = Tabs

/**
 * @description 标签概览 - 标签价值、热度、质量的折线图和排名
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class OverviewScore
 * @extends {React.Component}
 */
@observer
export default class OverviewScore extends React.Component {
  state = {
    currentTab: 'worth',
  }

  componentDidMount() {
    this.getPabelData('worth')
  }

  render() {
    const {store} = this.props
    const {currentTab} = this.state

    const {panelsData} = store

    return (
      <div className="bgf mt16 pt16">
        <Tabs
          activeKey={currentTab}
          tabBarExtraContent={(
            <TimeRange 
              custom
              exportTimeRange={(lte, gte) => {
                this.onTimeChange(lte, gte)
              }}
            />
          )}
          tabBarStyle={{padding: '0 24px', marginBottom: '0'}}
          animated={false}
          onChange={this.changeTab}
        >
          <TabPane tab="标签价值" key="worth">
            <OverviewScorePanel
              type="worth"
              {...panelsData.worth}
              onTableChange={(...args) => {
                this.onTableChange('worth', ...args)
              }}
            />
          </TabPane>
          <TabPane tab="标签热度" key="hot">
            <OverviewScorePanel
              type="hot"
              {...panelsData.hot}
              onTableChange={(...args) => {
                this.onTableChange('hot', ...args)
              }}
            />
          </TabPane>
          <TabPane tab="标签质量" key="quality">
            <OverviewScorePanel
              type="quality"
              {...panelsData.quality}
              onTableChange={(...args) => {
                this.onTableChange('quality', ...args)
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }

  // 切换tab
  @action.bound changeTab(activeKey) {
    this.setState({
      currentTab: activeKey,
    })
    this.getPabelData(activeKey)
  }

  // 获取某个panel的数据
  @action.bound getPabelData(type) {
    const {store} = this.props
    store.getScoreRank(type)
    store.getScoreTrend(type)
  }

  // 表格交互
  @action.bound onTableChange(type, pagination, filters, sorter) {
    const {store} = this.props
    const {panelsData} = store

    const {current, pageSize} = pagination
    const {field, order} = sorter

    panelsData[type].currentPage = current
    panelsData[type].pageSize = pageSize
    panelsData[type].sortKey = field
    panelsData[type].sortOrder = order

    store.getScoreRank(type)
  }

  // 更换时间
  @action.bound onTimeChange(lte, gte) {
    const {store} = this.props
    const {currentTab} = this.state

    store.scoreTimeRange = [lte, gte]
    
    // 更换时间后，排名表格都要回到第1页
    Object.keys(store.panelsData).forEach(key => {
      store.panelsData[key].currentPage = 1
    })

    this.getPabelData(currentTab)
  }
}
