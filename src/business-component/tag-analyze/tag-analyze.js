/**
 * @description 空值占比趋势
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Badge, Button, Divider, Progress} from 'antd'
// import Trend from './trend'
import Distribution from './distribution'

import store from './store'
import './distribution.styl'

import {getPieOpt} from './charts-options'

let chartsCount = 0
const data = []
const colors = [
  'rgba(0,197,122, 0.6)', 
  'rgba(10,192,220, 0.6)', 
  'rgba(57,167,255, 0.6)', 
  'rgba(90,106,254, 0.6)', 
  'rgba(149,51,255, 0.6)',
]
@observer
export default class TagAnalyze extends Component {
  myChart = null

  constructor(props) {
    super(props)
    store.tagId = props.tagId
  }

  componentWillMount() {
    store.getValueTrend({id: this.props.tagId}, pieData => {
      this.drawSaveTrend(pieData)
    })
  }
  componentDidUpdate(prevProps) {
    if (prevProps.tagId !== this.props.tagId) {
      store.getValueTrend({id: this.props.tagId}, pieData => {
        this.drawSaveTrend(pieData)
      })
    }
  }

  componentDidMount() {
    this.myChart = echarts.init(this.refs.chartsPie)
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChart && this.myChart.resize()
  }

  @action drawSaveTrend(pieData) {
    for (let i = 0; i < pieData.length; i++) {
      chartsCount += pieData[i].count
      const c = {
        value: pieData[i].ratio * 100,
        name: `${pieData[i].key} ${pieData[i].ratio * 100}% ${pieData[i].count}`,
      }
      data[i] = c 
    }
    this.myChart.setOption(getPieOpt(chartsCount, data))
  }

  render() {
    const {tagId} = this.props
    const {status, nullRatio, recordTime, name} = store.valueTrend
    return (
      <div className="p16 pt8 pr">
        <h3 className="chart-title">标签分布</h3>
        <Button 
          type="primary pa" 
          disabled={this.props.status !== 1}
          style={{top: '16px', right: '16px'}}
          onClick={store.getValueUpdate}
        >
          更新
        </Button>
        <p>
          <span className="mr16">{`${nullRatio * 100}%的实体拥有${name}这个标签`}</span>
          <Badge status={status !== 3 ? status !== 2 ? 'warning' : 'success' : 'error'} />
          <span className="mr16">{recordTime}</span>
        </p>
        {/* <Distribution store={store} /> */}
        <div className="chartPie-ad">
          <div ref="chartsPie" style={{height: '400px', width: '100%'}} />
          <div className="pie-tips FBH ablt">
            <ul className="mr8">
              {
                store.chartPieValues.map((item, index) => (
                  <li className="FBH FBAC mb4">
                    <span className="circle mb2 wh8" style={{backgroundColor: colors[index]}} />
                    <span className="interval">{item.key}</span>
                  </li>
                ))
              }
            </ul>
            <ul className="mr8">
              {
                store.chartPieValues.map(item => (
                  <li className="FBH FBAC mb4" style={{width: '150px'}}>
                    <Progress 
                      className="interval"
                      showInfo 
                      strokeWidth={4} 
                      strokeColor="#3187ff" 
                      percent={item.ratio * 100} 
                    />
                    <Divider type="vertical" />
                  </li>
                ))
              }
            </ul>
            <ul className="mr8">
              {
                store.chartPieValues.map(item => (
                  <li className="FBH FBAC mb4">
                    <span className="interval">{item.count}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div> 
      </div>
    )
  }
}
