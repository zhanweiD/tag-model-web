import React from 'react'
import PropTypes from 'prop-types'
import {Badge, Spin} from 'antd'
import EchartsChart from '../component-echarts-chart'
import {getPieChartOption, pieColorList} from './util'

/**
 * @description 饼图+图例等信息
 * @author 三千
 * @date 2019-08-12
 * @export
 * @class OverviewCallPie
 * @extends {React.Component}
 */
export default class OverviewCallPie extends React.Component {
  static propTypes = {
    list: PropTypes.array, // 数据
    total: PropTypes.number, // 展示在饼图中心的总数
    loading: PropTypes.bool, // 加载状态
  }

  static defaultProps = {
    list: [],
    total: 0,
    loading: false,
  }

  render() {
    const {list, total, loading} = this.props

    if (!list.length) {
      return null
    }

    // 只保留count有值的数据
    const validData = list.filter(item => item.count > 0)

    // echarts饼图配置对象
    const pieOption = getPieChartOption(validData)

    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="FBH FBJS FBAC mr24">
          <div className="pie-container">
            <EchartsChart
              option={pieOption}
              height={280}
            />
            <div className="pie-total">
              <div className="fs16">标签数</div>
              <div className="fs30">{total}</div>
            </div>
          </div>
          <div className="ml24 pie-info">
            {
              validData
                .map(({
                  startNum, endNum, count, ratio, orderKey,
                }, index) => {
                  const color = pieColorList[index]
                  const range = `${startNum} ~ ${endNum}`
                  return (
                    <div 
                      key={orderKey} 
                      className="FBH FBJB fs14 pt8 pb8" 
                      style={{width: '200px'}}
                    >
                      <span style={{width: '55%'}}>
                        <Badge color={color} text={range} />
                      </span>
                      <span style={{width: '35%'}}>{count}</span>
                      <span>{`${ratio}%`}</span>
                    </div>
                  )
                })
            }
          </div>
        </div>
      </Spin>
    )
  }
}
