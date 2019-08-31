import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {
  Button, Tooltip, Icon, Empty,
} from 'antd'
import {Time} from '../common/util'
import getPieOpt from './charts-options'

import store from './store-exponent'

let enumeChart

const colorList = ['#39A0FF', '#36CBCB', '#4DCB73', '#FAD338', '#F2637B', '#9760E4']

@observer
export default class Qzfb extends Component {
  componentWillMount() {
    store.getValueStatus()
  }

  // componentWillReceiveProps(nextProps) {
  //   if (store.id !== nextProps.aId && nextProps.isActive) {
  //     store.id = nextProps.aId
  //     this.getData()
  //     store.getValueStatus()
  //   }
  // }

  componentDidMount() {
    enumeChart = echarts.init(this.enume)

    this.getData()
    store.getValueStatus()
    window.addEventListener('resize', () => this.resize())
  }

  @action getData = () => {
    this.redrawEnume()
  }

  @action resize() {
    if (enumeChart && this.enume)enumeChart.resize()
  }

  @action redrawEnume() {
    store.getEnumeData(data => {
      const renderData = data.map(({
        count, key,
      }) => ({
        name: key,
        value: count,
      }))
      if (renderData.length)enumeChart.setOption(getPieOpt(renderData))
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.resize())
  }

  render() {
    const {total, pieTemplateDtoList, name} = store.enumeData

    return (
      <div className="p24 bgf">
        <h3 className="chart-title">标签枚举值分布</h3>
        <div className="far" style={{zIndex: 2, position: 'absolute', right: 20}}>
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
              : <Button type="primary" size="small" className="mr12" onClick={() => store.updateValue()}>数据更新</Button>
          }
        </div>
        <div className="pie">
          <div
            ref={el => this.enume = el}
            style={{width: '100%', height: '300px'}}
          /> 
          {
            pieTemplateDtoList.length 
              ? (
                <Fragment>
                  <div className="pie-total">
                    <div className="total">
                      <p className="mb0 fs16">{name}</p>
                      <p className="fs30">{total}</p>
                    </div>
                  </div>
                  <div className="pie-tips">
                    <ul className="mr32">
                      <li className="FBH mb8" style={{width: '350px'}}>
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
                          <li className="FBH mb8" style={{width: '350px'}}>
                            <div style={{width: '50%'}}>
                              <span className="circle mb2" style={{background: colorList[index]}} />
                              <span className="interval">{key}</span>
                            </div>
                            <span style={{width: '30%'}}>{`${(ratio * 100).toFixed(2)}%`}</span>
                            <span className="ml16" style={{width: '20%'}}>{count}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </Fragment>
              ) : <div className="empty-box"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
          }
        </div>
      </div>
    )
  }
}
