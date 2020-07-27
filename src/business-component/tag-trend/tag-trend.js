import {Component} from 'react'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import {TimeRange, NoData} from '../../component'
import getApiTrendOpt from './charts-options'
import store from './store'

@observer
export default class TagTrend extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')
  chartLine = null

  constructor(props) {
    super(props)
    store.tagId = props.tagId
  }

  componentWillMount() {
    store.getRatuoTrend(res => {
      // if (res.length) {
      this.drawChart(res)
      // }
    })
  }

  componentDidMount() {
    this.chartLine = echarts.init(this.lineRef)
    // this.getData()
    // store.getRatuoTrend(res => {
    //   if (res.length) this.drawChart(res)
    // })
    window.addEventListener('resize', () => this.resize())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tagId !== this.props.tagId) {
      store.tagId = this.props.tagId
      store.getRatuoTrend(res => {
        this.drawChart(res)
      })
    }
    this.drawChart(store.lineData)
  }

  drawChart = data => {
    this.chartLine.setOption(getApiTrendOpt(
      data
    ))
  }

  // @action getData(gte = this.defStartTime, lte = this.defEndTime) {
  //   const params = {
  //     startDate: gte,
  //     endDate: lte,
  //   }

  //   store.getRatuoTrend(res => {
  //     if (res.length) this.drawChart(res)
  //   })
  // }

  @action resize() {
    if (this.chartLine) this.chartLine.resize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.resize())
    if (this.chartLine) this.chartLine.dispose()
    this.chartLine = null
  }

  render() {
    const {tagId} = this.props
    const {lineData} = store
    const noDataConfig = {
      text: '暂无趋势信息',
    }
    return (
      <div className="p16">
        <h3 className="chart-title">空值占比趋势</h3>
        {/* <div className="time-range-wrap">
          <TimeRange
            custom
            key={tagId}
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
        </div> */}
        <div style={{display: lineData.length ? 'block' : 'none', height: '300px'}} ref={ref => this.lineRef = ref} />
        {!lineData.length && <NoData {...noDataConfig} />}
      </div>
    )
  }
}
