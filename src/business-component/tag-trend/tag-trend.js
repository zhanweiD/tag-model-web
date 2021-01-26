import intl from 'react-intl-universal'
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import {TimeRange, NoData} from '../../component'
import getApiTrendOpt from './charts-options'
import store from './store'

@observer
class TagTrend extends Component {
  chartLine = null

  constructor(props) {
    super(props)
    store.tagId = props.tagId
    store.projectId = props.projectId
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
    if (this.chartLine) {
      this.chartLine.setOption(getApiTrendOpt(data))
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.resize())
    if (this.chartLine) this.chartLine.dispose()
    this.chartLine = null
  }

  render() {
    const {tagId} = this.props
    const {lineData, projectId} = store
    const noDataConfig = {
      text: intl
        .get('ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils')
        .d('暂无数据'),
    }

    return (
      <div
        className="pt16 pb16 pl24 pr24"
        style={{width: '100%', position: 'relative'}}
      >
        <h3>
          {intl
            .get('ide.src.business-component.tag-trend.tag-trend.40b08h2rq0b')
            .d('空值占比趋势')}
        </h3>
        
        {!lineData.length && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: 'calc(100vh - 538px)',
            }}
          >
            <NoData {...noDataConfig} />
          </div>
        )}
        
        <div
          style={{width: '100%', height: '400px'}}
          ref={ref => (this.lineRef = ref)}
        />
      </div>
    )
  }
}
export default TagTrend
