import React from 'react'
import PropTypes from 'prop-types'
import * as echarts from 'echarts'
import {Spin} from 'antd'

export default class LineChart extends React.Component {
  static defaultProps = {
    data: [],
    loading: false,
    height: 400,
  }

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object), // 折线图数据
    loading: PropTypes.bool, // 数据加载的情况提供可选的loading效果
    height: PropTypes.number, // 图表的高度
    // TODO: 可以配置要读取的key值，这样相同数据结构但不同字段也可以；或者直接传入echarts配置项格式的data？
  }

  // canvas容器元素
  el = null

  // echarts实例
  chartInstance = null

  componentDidMount() {
    this.chartInstance = echarts.init(this.el)
    this.updateChart()
    // TODO: 窗口变化时，自动更新图表，然而暂时没用，需要处理
    window.addEventListener('resize', this.updateChart)
  }

  // componentDidUpdate() {
  //   this.updateChart()
  // }

  componentWillUnmount() {
    this.chartInstance.dispose()
    window.removeEventListener('resize', this.updateChart)
  }

  render() {
    const {loading, height} = this.props
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div 
          ref={el => this.el = el} 
          style={{width: '100%', height: height || '100%', border: '1px solid #000'}} 
        />
      </Spin>
    )
  }

  // 获取图表的option配置项
  // TODO: 根据数据结构再来定
  getOption() {
    // return {}
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      }],
    }
  }

  // 绘制图表
  updateChart = () => {
    this.chartInstance.clear() // 清空画布
    const option = this.getOption()
    this.chartInstance.setOption(option)
  }
}
