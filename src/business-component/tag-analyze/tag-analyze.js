import intl from 'react-intl-universal'
/**
 * @description 值域分布趋势
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Badge, Button, Divider, Progress} from 'antd'

import store from './store'
import './tag-analyze.styl'

import {getPieOpt} from './charts-options'

const colors = [
  'rgba(0,197,122, 0.6)',
  'rgba(10,192,220, 0.6)',
  'rgba(57,167,255, 0.6)',
  'rgba(90,106,254, 0.6)',
  'rgba(149,51,255, 0.6)',
]

@observer
class TagAnalyze extends Component {
  myChart = null

  constructor(props) {
    super(props)
    store.tagId = props.tagId
    store.projectId = props.projectId
  }

  // componentWillMount() {
  //   store.getValueTrend({id: this.props.tagId}, pieData => {
  //     this.drawSaveTrend(pieData)
  //   })
  // }

  componentDidMount() {
    this.myChart = echarts.init(this.refs.chartsPie)
    store.getValueTrend(pieData => {
      this.drawSaveTrend(pieData)
    })
    window.addEventListener('resize', () => this.resize())
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      store.tagId = this.props.tagId
      store.getValueTrend(pieData => {
        this.drawSaveTrend(pieData)
      })
    }
  }

  @action resize() {
    this.myChart && this.myChart.resize()
  }

  @action drawSaveTrend(pieData) {
    let chartsCount = 0
    const data = []
    for (let i = 0; i < pieData.length; i++) {
      chartsCount += pieData[i].count
      const c = {
        value: pieData[i].ratio.toFixed(2),
        name: `${pieData[i].key} ${pieData[i].ratio.toFixed(2)}% ${
          pieData[i].count
        }`,
      }

      data[i] = c
    }
    this.myChart.setOption(getPieOpt(chartsCount, data))
  }

  render() {
    const {tagId, authorStatus} = this.props
    const {status, nullRatio, recordTime, name} = store.valueTrend
    const valueRatio = (1 - nullRatio) * 100 || 0
    
    return (
      <div className="pb16 pt16 pl24 pr24 pr">
        <h3>
          {intl
            .get(
              'ide.src.business-component.tag-analyze.tag-analyze.r4bflvdfh3f'
            )
            .d('值域分布')}
        </h3>
        <Button
          type="primary pa"
          disabled={status === 1}
          style={{
            top: '16px',
            right: '16px',
            display: authorStatus !== 2 ? 'none' : 'block',
          }}
          onClick={() => store.getValueUpdate(pieData => {
            this.drawSaveTrend(pieData)
          })
          }
        >
          {intl
            .get(
              'ide.src.business-component.tag-analyze.tag-analyze.3lashi9hb7l'
            )
            .d('更新')}
        </Button>
        <p>
          <span className="mr16">
            {intl
              .get(
                'ide.src.business-component.tag-analyze.tag-analyze.4hcdsnvdk6d',
                {valueRatio, name},
              )
              .d('{valueRatio}%的实体拥有{name}这个标签')}
          </span>
          <Badge
            status={
              status !== 3 ? (status !== 2 ? 'processing' : 'success') : 'error'
            }
          />
          <span className="mr16">{recordTime}</span>
        </p>
        <div className="chartPie-ad">
          <div ref="chartsPie" style={{height: '390px', width: '100%'}} />
          <div className="pie-tips FBH ablt">
            <ul className="mr8">
              {store.chartPieValues.map((item, index) => (
                <li className="FBH FBAC mb4">
                  <span
                    className="circle mb2 wh8"
                    style={{backgroundColor: colors[index]}}
                  />
                  <span className="interval">{item.key}</span>
                </li>
              ))}
            </ul>
            <ul className="mr8">
              {store.chartPieValues.map(item => (
                <li className="FBH FBAC mb4" style={{width: '150px'}}>
                  <Progress
                    className="interval"
                    showInfo
                    status="active"
                    strokeWidth={4}
                    strokeColor="#3187ff"
                    percent={item.ratio.toFixed(2)}
                  />

                  <Divider type="vertical" />
                </li>
              ))}
            </ul>
            <ul className="mr8">
              {store.chartPieValues.map(item => (
                <li className="FBH FBAC mb4">
                  <span className="interval">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default TagAnalyze
