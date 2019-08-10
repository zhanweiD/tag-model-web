import {Component} from 'react'
import {
  action,
} from 'mobx'
import TimeRange from '../time-range'
import {getTagTrendOpt} from './charts-options'

export default class TrendTag extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')
  chartLine = null

  componentDidMount() {
    this.getData()
    window.addEventListener('resize', () => this.resize())
  }

  drawChart = data => {
    this.chartLine = echarts.init(this.lineRef)

    const legend = data[0] && data[0].data.map(d => d.name)

    this.chartLine.setOption(getTagTrendOpt(
      data, legend
    ))
  }


  @action getData(gte = this.defStartTime, lte = this.defEndTime) {
    const {store} = this.props
    const params = {
      startDate: gte,
      endDate: lte,
    }
    
    // change
    store.getTagTrend(params, res => {
      this.drawChart(res) 
    })
  }

  @action resize() {
    if (this.chartLine) {
      this.chartLine.resize()
    }
  }

  componentWillUnmount() {
    if (this.chartLine) {
      this.chartLine.dispose()
    }
    this.chartLine = null
  }

  render() {
    return (
      <div className="chart mb16">
        <h3 className="ct-title">标签调用次数趋势</h3>
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
            exportTimeRange={(gte, lte) => this.getData(gte, lte)}
          />
        </div>
        <div style={{height: '300px'}} ref={ref => this.lineRef = ref} />
      </div>
    )
  }
}