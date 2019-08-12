import React from 'react'
import PropTypes from 'prop-types'
import * as echarts from 'echarts'
import {Spin} from 'antd'
import {isEqual} from 'lodash'

export default class EchartsChart extends React.Component {
  el = null
  chartInstance = null

  static propTypes = {
    option: PropTypes.object.isRequired, // Echarts的配置项对象，必传
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 容器的宽度
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 容器的高度
    loading: PropTypes.bool, // 数据加载中
    compareValues: PropTypes.array, // 用来判断图表是否需要更新的prop，详见shouldComponentUpdate
  }

  static defaultProps = {
    width: '100%',
    height: '100%',
    loading: false,
    compareValues: null,
  }

  componentDidMount() {
    // 初始化echarts实例
    this.chartInstance = echarts.init(this.el)
    // 初始化渲染
    this.updateChart()

    // 屏幕尺寸变化时触发图表变化
    window.addEventListener('resize', this.resizeChart)
  }

  componentDidUpdate() {
    this.updateChart()
  }

  // 避免因为父组件更新导致图表不必要的更新，避免频繁触发动画；（这个判断是牺牲一定的性能换取合理的操作表现）
  shouldComponentUpdate(nextProps, nextState) {
    const {
      width,
      height,
      loading,
      compareValues,
    } = this.props

    // 由于Echarts的option很可能包含函数，这样的话即使深度遍历比较的结果也是false;
    // 所以不比较option，而是通过提供一个专门用来判断是否需要更新的prop，也就是 compareValues；
    // 同理，compareValues中也不应该包含函数；
    // 通常来说，这个值会是用来渲染图表的初始数据（转成option之前的）;
    // 另外要注意的是，引用类型的话，要注意避免指向同一个对象，所以compareValues里可以包含的是一份copy
    if (
      width === nextProps.width
      && height === nextProps.height
      && loading === nextProps.loading
      && (compareValues && isEqual(compareValues, nextProps.compareValues))
    ) {
      return false
    }
    return true
  }

  componentWillUnmount() {
    // 清理事件监听器
    window.removeEventListener('resize', this.resizeChart)
    this.chartInstance.dispose()
    this.el = null
  }

  render() {
    const {width, height, loading} = this.props

    return (
      <Spin tip="Loading..." spinning={loading}>
        <div 
          ref={el => this.el = el}
          className="comp-echarts-chart"
          style={{
            width,
            height,
            // border: '1px solid #000', // 测试用边框
          }}
        />
      </Spin>
    )
  }

  // 绘制图表
  updateChart() {
    const {option} = this.props

    this.chartInstance.clear()
    this.chartInstance.setOption(option)
  }

  // 图表尺寸更新
  resizeChart = () => {
    this.chartInstance.resize()
  }
}
