import moment from 'moment'
import {dateFormat} from '../common/constants'

// 排序字段的映射，antd Table sorter字段 -> 后端接口要的字段
const ORDER_MAP = {
  ascend: 'ASC',
  descend: 'DESC',
}

// 标签价值、热度、质量，关键词到文本的映射
const TYPE_TEXT_MAP = {
  worth: '价值分',
  hot: '热度',
  quality: '质量分',
}

// 利用排序字段映射获取对应的接口字段
export function getOrderAlias(name) {
  return ORDER_MAP[name]
}

// 获取价值分等折线图的echarts配置项对象
export function getLineChartOption(data, type = 'worth') {
  const tipText = TYPE_TEXT_MAP[type]
  return {
    grid: {
      top: 16,
      left: 30,
      right: 10,
      bottom: 24,
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        // console.log('echarts tooltip' , params)
        const param = params[0]
        let str = `${moment(+param.axisValue).format(dateFormat)} <br/>`
        str += `${param.marker} 标签平均${tipText}: ${param.data} <br/>`
        return str
      },
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: {
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.key),
      axisLabel: {
        formatter: v => moment(+v).format('MM-DD'),
        textStyle: {
          // color: 'rgba(0, 0, 0, 0.65)',
          color: 'rgba(0, 0, 0)',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        textStyle: {
          color: 'rgba(0, 0, 0)',
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: [{
      type: 'line',
      data: data.map(item => item.value),
      itemStyle: {
        color: 'rgba(0,197,122)',
      },
      symbol: 'none',
    }],
  }
}

// 饼图颜色
export const pieColorList = ['#39A0FF', '#36CBCB', '#4DCB73', '#FAD338', '#F2637B', '#9760E4']

// 获取标签调用的饼图配置项
export function getPieChartOption(data) {
  const radius = 120

  return {
    series: [{
      type: 'pie',
      radius: [radius - 25, radius],
      center: [radius + 10, radius + 20],
      label: {
        show: false,
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      yAxis: {
        position: 'left',
      },
      data: data.map(d => ({
        value: +d.count,
      })),
      // data: data.map(d => +d.count),
      itemStyle: {// 元素样式
        normal: {
          // 对每个颜色赋值 
          color: item => pieColorList[item.dataIndex],
        },
      },
    }],
  }
}
