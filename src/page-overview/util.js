const nameTextStyleColor = 'rgba(0, 0, 0, .45)'

const colors = [
  'rgba(0,197,122, 0.6)', 
  'rgba(10,192,220, 0.6)', 
  'rgba(57,167,255, 0.6)', 
  'rgba(90,106,254, 0.6)', 
  'rgba(149,51,255, 0.6)',
]

export const pieOpt = data => {
  return {
    color: colors,
    grid: {
      left: 50,
      right: 50,
      top: 30,
      bottom: 30,
    },
    tooltip: {
      trigger: 'item',
      // formatter: params => {
      // return `${params.name}<br />实体数: ${params.value}<br />占比: ${params.percent}%`
      // },  
      formatter: '{b}: {c} ({d}%)', 
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '60%'],
        avoidLabelOverlap: true,
        animation: false,
        labelLine: {
          show: true,
        },
        label: {
          formatter(v) {
            return v.data.value > 999999 ? `${v.data.name}:\n${v.data.value}` : `${v.data.name}:${v.data.value}`
          }, 
        },
        // label: {
        //   formatter: '{b}: {c}', 
        // },
        data,
      },
    ],
  }
} 

export const lineOpt = data => {
  return {
    color: colors,
    grid: {
      left: 50,
      right: 50,
      top: 30,
      bottom: 30,
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        return `日期: ${params[0].axisValue}<br />总调用次数: ${params[0].data}`
      },   
    },
    xAxis: {
      type: 'category',
      data: _.map(data, 'key'),
      axisLine: {
        lineStyle: {
          color: '#E9E9E9',
        },
      },
      axisLabel: {
        formatter: value => moment(+value).format('YYYY-MM-DD'),
        textStyle: {
          color: nameTextStyleColor,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#E9E9E9',
        },
      },
      axisLabel: {
        textStyle: {
          color: nameTextStyleColor,
        },
      },
    },
    series: [{
      data: _.map(data, 'value'),
      type: 'line',
    }],
  }
}
