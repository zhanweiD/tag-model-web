import {dateFormat} from '../common/constants'

const colors = [
  'rgba(0,197,122, 0.6)', 
  'rgba(10,192,220, 0.6)', 
  'rgba(57,167,255, 0.6)', 
  'rgba(90,106,254, 0.6)', 
  'rgba(149,51,255, 0.6)',
]
const nameTextStyleColor = 'rgba(0, 0, 0, .45)'
const barColor = '#9FE6B8'
const areaColor = '#31C5E9'


// 标签调用次数趋势图配置
export function getTagTrendOpt(data, legend = []) {
  const series = legend.map(name => ({
    name,
    type: 'line',
    symbol: 'none',
    smooth: 0.3,
    data: _.map(data, d => {
      const obj = d.data.filter(i => i.name === name)[0]
      return obj.count
    }),
  }))

  return {
    grid: {
      containLabel: true,
      x: 10,
      y: 30,
      x2: 10,
      y2: 35,
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const domArr = [`日期: ${moment(+params[0].axisValue).format(dateFormat)} <br/>总调用次数: ${data[+params[0].dataIndex].totalCount}<br/>`]
        params.map((
          item, idx
        ) => domArr.push(
          `${params[idx].marker} ${params[idx].seriesName}: ${params[idx].data} <br/>`
        ))
        return domArr.join(' ')
      },
    },
    legend: {
      // y: 0,
      bottom: 0,
      data: legend,
      textStyle: {
        color: nameTextStyleColor,
      },
    },
    xAxis: {
      type: 'category',
      data: _.map(data, 'date'),
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
    yAxis: [
      {
        type: 'value',
        min: 0,
        name: '标签调用次数',
        nameTextStyle: {
          padding: [0, 0, 0, 30],
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
    ],
    color: colors,
    series,
  }
}

// API调用数趋势图配置
export function getApiTrendOpt(data) {
  return {
    grid: {
      containLabel: true,
      x: 10,
      y: 30,
      x2: 10,
      y2: 35,
    },
    
    tooltip: {
      trigger: 'axis',
      formatter: params => `日期: ${moment(+params[0].axisValue).format(dateFormat)} <br/>API调用数: ${params[0].value}`,   
    },

    xAxis: {
      type: 'category',
      data: _.map(data, 'date'),
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
    yAxis: [
      {
        type: 'value',
        min: 0,
        name: 'API调用数',
        nameTextStyle: {
          padding: [0, 0, 0, 30],
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
    ],
    color: colors,
    series: [
      {
        type: 'line',
        data: _.map(data, 'count'),
      },
    ],
  }
}
