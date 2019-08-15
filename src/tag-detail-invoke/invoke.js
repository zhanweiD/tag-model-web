import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import OverviewCard from '../component-overview-card'
import TimeRange from '../time-range'
import getInvokeOpt from './charts-options'

import store from './store-invoke'

@observer
export default class Invoke extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')
  invokeChart = null

  componentDidMount() {
    this.getData()
    window.addEventListener('resize', this.resize)
  }

  drawChart = data => {
    if (this.invokeChart) this.invokeChart.clear()

    this.invokeChart = echarts.init(this.lineRef)
    
    this.invokeChart.setOption(getInvokeOpt(
      data
    ))
  }

  @action getData(gte = this.defStartTime, lte = this.defEndTime) {
    const params = {
      startDate: gte,
      endDate: lte,
    }
    
    store.getInvokeData(params, data => {
      this.drawChart(data)
    })
  }

  @action resize = () => {
    if (this.chartLine) this.chartLine.resize()
  }

  componentWillUnmount() {
    if (this.chartLine) this.chartLine.dispose()
    this.chartLine = null
    window.removeEventListener('resize', this.resize)
  }

  render() {
    const {key1, key2, key3} = {
      key1: 1,
      key2: 2,
      key3: 3,
    }

    // 注： 标签调用指标卡 接口格式 暂未给出 @望舒
    const cards = [
      {
        title: '被API调用的次数',
        tooltipText: '标签被API调用的历史总次数',
        values: [key1],
      },
      {
        title: '调用的API数',
        tooltipText: '标签被调用的历史API数',
        values: [key2],
      },
      {
        title: '使用的场景数',
        tooltipText: '当前标签被使用的场景数',
        values: [key3],
      },
    ]
    return (
      <div className="invoke">
        <div className="FBH bgf pt24 pb24 mb16">
          {
            cards.map((item, index) => (
              <div className="FB1" style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
                <OverviewCard {...item} />
              </div>
            ))
          }
        </div>
        <div className="mb32 p16 bgf">
          <h3 className="ct-title">调用趋势</h3>
          <div className="time-range-wrap">
            <TimeRange
              custom
              defaultRangeInx={0}
              rangeMap={[{
                value: 7,
                label: '最近7天',
              }, {
                value: 30,
                label: '最近30天',
              }]}
              exportTimeRange={(gte, lte) => this.updateDate(gte, lte)}
            />
          </div>
          <div>
            <span className="d-block fs12 pl8 pb8">{`存储量趋势(${store.stoSubDesc})`}</span>
            <div
              ref={el => this.lineRef = el}
              style={{width: '100%', height: '350px'}}
            />
          </div>
        </div>
      </div>
    )
  }
}