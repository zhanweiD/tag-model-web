import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Tooltip, Icon} from 'antd'
import TimeRange from '../time-range'
import {getLineChartOpt} from '../common/config-charts'
import OverviewCard from '../component-overview-card'
import {Time} from '../common/util'
import getPieOpt from './charts-options'

import store from './store-exponent'

let vsChart
let qsChart
let hotChart
let enumeChart

const colorList = ['#39A0FF', '#36CBCB', '#4DCB73', '#FAD338', '#F2637B', '#9760E4']

@observer
export default class Exponent extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')

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
    enumeChart = echarts.init(this.enume)

    this.redrawVs() 
    this.redrawQs()
    this.redrawHot()
    store.getEnumeData(data => {
      this.redrawEnume(data)
    })
    window.addEventListener('resize', this.resize)
  }

  @action resize = () => {
    if (vsChart)vsChart.resize()
    if (qsChart)qsChart.resize()
    if (hotChart)hotChart.resize()
    if (enumeChart)enumeChart.resize()
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

  @action redrawEnume = data => {
    const renderData = data.map(({
      count, key,
    }) => ({
      name: key,
      value: count,
    }))
    enumeChart.setOption(getPieOpt(renderData))
  }

  componentWillUnmount() {
    if (vsChart)vsChart.dispose()
    if (qsChart)qsChart.dispose()
    if (hotChart)hotChart.dispose()

    window.removeEventListener('resize', this.resize)
  }

  render() {
    const {worthScore, qualityScore, hotScore} = store.dailyCard
    const {total, pieTemplateDtoList} = store.enumeData
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
        <div className="mb16 p16 bgf">
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

        <div className="mb16 p16 bgf">
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
        <div className="mb16 p16 bgf">
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

        <div className="p16 bgf">
          <h3 className="ct-title">标签枚举值分布</h3>
          <div className="far" style={{zIndex: 2, position: 'absolute', right: 0}}>
            {/* <div className={cls('far', {hide: !store.valueEnumList.length})}> */}
            <span className="mr12">
            数据更新时间：
              <Time timestamp={store.updateTime} />
            </span>
            {
              store.status === 1
                ? (
                  <Fragment>
                    <Button type="primary" size="small" className="mr12" disabled>更新中</Button>
                    <Tooltip placement="left" title="预计10分钟左右完成数据更新。">
                      <Icon type="question-circle" />
                    </Tooltip>
                  </Fragment>
                )
                : <Button type="primary" size="small" className="mr12" onClick={() => store.updateEnumeData()}>数据更新</Button>
            }
          </div>
          <div className="pie">
            <div
              ref={el => this.enume = el}
              style={{width: '100%', height: '300px'}}
            /> 
            <div className="pie-total">
              <div className="total">
                <p className="mb0 fs16">标签名称</p>
                <p className="fs30">{total}</p>
              </div>
            </div>
            <div className="pie-tips">
              <ul className="mr32">
                <li className="FBH mb4" style={{width: '300px'}}>
                  <div style={{width: '50%'}}>
                    <span className="ml24">取值</span>
                  </div>
                  <span style={{width: '30%'}}>记录数占比</span>
                  <span className="ml16" style={{width: '20%'}}>记录数</span>
                </li>
                {
                  pieTemplateDtoList.map(({
                    count, key, ratio,
                  }, index) => (
                    <li className="FBH mb4" style={{width: '300px'}}>
                      <div style={{width: '50%'}}>
                        <span className="circle mb2" style={{background: colorList[index]}} />
                        <span className="interval">{key}</span>
                      </div>
                      <span style={{width: '30%'}}>{`${ratio * 100}%`}</span>
                      <span className="ml16" style={{width: '20%'}}>{count}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
