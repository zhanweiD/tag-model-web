import {Component, Fragment} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Modal} from 'antd'
import TimeRange from '../time-range'
import {getLineChartOpt} from '../common/config-charts'

import store from './store-exponent'

let vsChart
let qsChart
let hotChart

@observer
export default class Exponent extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {aId} = this.props
    if (aId) {
      store.id = aId
      store.getDailyCard()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (store.id !== nextProps.aId) {
      store.id = nextProps.aId
      store.getDailyCard()
    }
  }

  componentDidMount() {
    vsChart = echarts.init(this.vs)
    qsChart = echarts.init(this.qs)
    hotChart = echarts.init(this.hot)
    this.redrawVs()
    this.redrawQs()
    this.redrawHot()
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    vsChart.resize()
    qsChart.resize()
    hotChart.resize()
  }

  @action redrawVs(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(1, gte, lte, () => {
      vsChart.setOption(getLineChartOpt({data: toJS(store.vsTrend), title: '价值分'}))
    })
  }

  @action redrawQs(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(3, gte, lte, () => {
      qsChart.setOption(getLineChartOpt({data: toJS(store.qsTrend), title: '质量分'}))
    })
  }

  @action redrawHot(gte = this.defStartTime, lte = this.defEndTime) {
    store.getDailyVs(2, gte, lte, () => {
      hotChart.setOption(getLineChartOpt({data: toJS(store.hotTrend), title: '标签热度'}))
    })
  }

  render() {
    const {worthScore, qualityScore, hotScore} = store.dailyCard

    console.log(this.id)
    return (
      <div className="p16">
        <div>
          最新价值分: 
{' '}
{worthScore}
{' '}
通过标签的覆盖度、活跃度、鲜活度反映标签的价值
          最新质量分:
{' '}
{qualityScore}
{' '}
通过字段的完整性、规范性反映标签的质量
          最新热度:
{' '}
{hotScore}
{' '}
通过标签的调用度反映标签热度
</div>
        <div className="mb32">
          <h3 className="ct-title">标签价值分趋势</h3>
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
              exportTimeRange={(gte, lte) => this.redrawVs(gte, lte)}
            />
          </div>
          <div
            ref={el => this.vs = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>

        <div className="mb32">
          <h3 className="ct-title">标签质量分趋势</h3>
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
              exportTimeRange={(gte, lte) => this.redrawQs(gte, lte)}
            />
          </div>
          <div
            ref={el => this.qs = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>

        <div className="mb32">
          <h3 className="ct-title">标签热度趋势</h3>
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
              exportTimeRange={(gte, lte) => this.redrawHot(gte, lte)}
            />
          </div>
          <div
            ref={el => this.hot = el}
            style={{width: '100%', height: '300px'}}
          />
        </div>
      </div>
    )
  }
}
