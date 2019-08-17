import {dateFormat} from '../common/constants'

const nameTextStyleColor = 'rgba(0, 0, 0, .45)'
const barColor = '#9FE6B8'
const areaColor = '#31C5E9'

// 调用趋势图表配置
export default function getInvokeOpt(data) {
  return {
    grid: {
      containLabel: true,
      x: 10,
      y: 30,
      x2: 10,
      y2: 0,
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => (`
          日期: ${moment(+params[0].axisValue).format(dateFormat)}<br/>
          被调用次数: ${params[0].data}<br/>
          调用API数: ${params[1].data}
      `),
    },
    legend: {
      data: ['被调用次数', '调用API数'],
      textStyle: {
        color: nameTextStyleColor,
      },
    },
    xAxis: [
      {
        type: 'category',
        // boundaryGap: false,
        data: _.map(data, 'key'),
        axisLabel: {
          formatter: value => moment(+value).format('MM-DD'),
          textStyle: {
            color: nameTextStyleColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#E9E9E9',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        name: '被调用次数',
        nameTextStyle: {
          padding: [0, 0, 0, 50],
          color: nameTextStyleColor,
        },
        minInterval: 1,
        // max: 250,
        // interval: 50,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: nameTextStyleColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#E9E9E9',
          },
        },
      },
      {
        type: 'value',
        min: 0,
        name: '调用API数',
        nameTextStyle: {
          padding: [0, 55, 0, 0],
          color: nameTextStyleColor,
        },
        minInterval: 1,
        // max: 250,
        // interval: 50,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: nameTextStyleColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#E9E9E9',
          },
        },
        splitLine: {show: false},
      },
    ],
    series: [
      {
        name: '被调用次数',
        type: 'line',
        data: _.map(data, 'apiInvokeCount'),
        itemStyle: {
          normal: {
            color: areaColor,
            areaStyle: {type: 'default', opacity: 0.2}, // 面积图
          },
        },
      },
      {
        name: '调用API数',
        type: 'bar',
        yAxisIndex: 1,
        data: _.map(data, 'apiCount'),
        barWidth: 30,
        itemStyle: {
          normal: {
            color: barColor,
          },
        },
      },
    ],
  }
}
