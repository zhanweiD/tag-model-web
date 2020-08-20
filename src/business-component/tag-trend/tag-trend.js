import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import {TimeRange, NoData} from '../../component'
import getApiTrendOpt from './charts-options'
import store from './store'

@observer
export default class TagTrend extends Component {
  // defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  // defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')
  chartLine = null

  constructor(props) {
    super(props)
    store.tagId = props.tagId
  }

  componentDidMount() {
    this.chartLine = echarts.init(this.lineRef)
    // this.getData()
    store.getRatuoTrend(res => {
      if (res.length) this.drawChart(res)
    })
    window.addEventListener('resize', () => this.resize())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tagId !== this.props.tagId) {
      store.tagId = this.props.tagId
      store.getRatuoTrend(res => {
        this.drawChart(res)
      })
    }
    // this.drawChart(store.lineData)
  }

  @action resize() {
    this.chartLine && this.chartLine.resize()
  }

  @action drawChart = data => {
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

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.resize())
    if (this.chartLine) this.chartLine.dispose()
    this.chartLine = null
  }

  render() {
    const {tagId} = this.props
    const {lineData} = store
    const noDataConfig = {
      text: '暂无数据',
    }
    return (
      <div className="p16" style={{width: '100%', position: 'relative'}}>
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
        {!lineData.length && <div style={{position: 'absolute', width: '100%', height: 'calc(100vh - 430px)'}}><NoData {...noDataConfig} /></div>}
        <div 
          style={{width: '100%', height: '400px'}} 
          ref={ref => this.lineRef = ref} 
        />
      </div>
    )
  }
}
