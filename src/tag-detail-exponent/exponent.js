import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {
  Button, Tooltip, Icon, Empty,
} from 'antd'
import TimeRange from '../time-range'
import {getLineChartOpt} from '../common/config-charts'
import OverviewCard from '../component-overview-card'
// import {Time} from '../common/util'
// import getPieOpt from './charts-options'
import Qzfb from './qzfb'

import store from './store-exponent'

let vsChart
let qsChart
let hotChart
// let enumeChart

// const colorList = ['#39A0FF', '#36CBCB', '#4DCB73', '#FAD338', '#F2637B', '#9760E4']

@observer
export default class Exponent extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')

  componentWillMount() {
    const {aId} = this.props
    if (aId) {
      store.id = aId
      store.getDailyCard()
      // store.getValueStatus()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (store.id !== nextProps.aId && nextProps.isActive) {
      store.id = nextProps.aId
      this.getData()
      store.getDailyCard()
      // store.getValueStatus()
    }
  }

  componentDidMount() {
    vsChart = echarts.init(this.vs)
    qsChart = echarts.init(this.qs)
    hotChart = echarts.init(this.hot)
    // enumeChart = echarts.init(this.enume)

    this.getData()
    // store.getValueStatus()
    window.addEventListener('resize', this.resize)
  }

  @action getData = () => {
    this.redrawVs() 
    this.redrawQs()
    this.redrawHot()
    // this.redrawEnume()
  }

  @action resize() {
    if (vsChart) vsChart.resize()
    if (qsChart) qsChart.resize()
    if (hotChart)hotChart.resize()
    // if (enumeChart && this.enume)enumeChart.resize()
  }

  @action redrawVs(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(1, gte, lte, () => {
      vsChart.setOption(getLineChartOpt({data: toJS(store.vsTrend), title: '应用价值分'}))
    })
  }

  @action redrawQs(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(3, gte, lte, () => {
      qsChart.setOption(getLineChartOpt({data: toJS(store.qsTrend), title: '标签质量分'}))
    })
  }

  @action redrawHot(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(2, gte, lte, () => {
      hotChart.setOption(getLineChartOpt({data: toJS(store.hotTrend), title: '标签热度'}))
    })
  }

  // @action redrawEnume() {
  //   store.getEnumeData(data => {
  //     const renderData = data.map(({
  //       count, key,
  //     }) => ({
  //       name: key,
  //       value: count,
  //     }))
  //     if (renderData.length)enumeChart.setOption(getPieOpt(renderData))
  //   })
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    if (vsChart)vsChart.dispose()
    if (qsChart)qsChart.dispose()
    if (hotChart)hotChart.dispose()
  }

  render() {
    const {worthScore, qualityScore, hotScore} = store.dailyCard
    // const {total, pieTemplateDtoList, name} = store.enumeData
    const {aId, baseInfo} = this.props
    const cards = [
      {
        title: '最新价值分',
        tooltipText: '通过标签的覆盖度、活跃度、鲜活度反映标签的价值',
        values: [worthScore],
      },
      {
        title: '最新质量分',
        tooltipText: '通过字段的完整性、规范性反映标签的质量',
        values: [qualityScore],
      },
      {
        title: '最新热度',
        tooltipText: '通过标签的调用度反映标签热度',
        values: [hotScore],
      },
    ]
    return (
      <div className="exponent">
        <div className="FBH bgf pt24 pb24 mb16">
          {
            cards.map((item, index) => (
              <div className="FB1" style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
                <OverviewCard {...item} />
              </div>
            ))
          }

        </div>
        <div className="mb16 p24 bgf">
          <h3 className="chart-title">价值分趋势</h3>
          <div className="time-range-wrap">
            <TimeRange
              key={aId}
              custom
              defaultRangeInx={0}
              rangeMap={[{
                value: 7,
                label: '最近7天',
              }, {
                value: 30,
                label: '最近30天',
              }]}
              exportTimeRange={(gte, lte) => this.redrawVs(gte, lte)}
            />
          </div>
          <div
            ref={el => this.vs = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>

        <div className="mb16 p24 bgf">
          <h3 className="chart-title">质量分趋势</h3>
          <div className="time-range-wrap">
            <TimeRange
              key={aId}
              custom
              defaultRangeInx={0}
              rangeMap={[{
                value: 7,
                label: '最近7天',
              }, {
                value: 30,
                label: '最近30天',
              }]}
              exportTimeRange={(gte, lte) => this.redrawQs(gte, lte)}
            />
          </div>
          <div
            ref={el => this.qs = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>
        <div className="mb16 p24 bgf">
          <h3 className="chart-title">标签热度趋势</h3>
          <div className="time-range-wrap">
            <TimeRange
              key={aId}
              custom
              defaultRangeInx={0}
              rangeMap={[{
                value: 7,
                label: '最近7天',
              }, {
                value: 30,
                label: '最近30天',
              }]}
              exportTimeRange={(gte, lte) => this.redrawHot(gte, lte)}
            />
          </div>
          <div
            ref={el => this.hot = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>
        {!!baseInfo && !!baseInfo.isEnum && <Qzfb />}
      </div>
    )
  }
}
