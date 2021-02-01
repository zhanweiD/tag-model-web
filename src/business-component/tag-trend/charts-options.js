import intl from 'react-intl-universal'

const colors = [
  'rgba(0,197,122, 0.6)',
  'rgba(10,192,220, 0.6)',
  'rgba(57,167,255, 0.6)',
  'rgba(90,106,254, 0.6)',
  'rgba(149,51,255, 0.6)',
]

const nameTextStyleColor = 'rgba(0, 0, 0, .45)'

// API调用数趋势图配置
export default function getApiTrendOpt(data) {
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
      formatter: params => {
        const paramsAxisValue = params[0].axisValue
        const paramsValue = params[0].value
        return intl
          .get(
            'ide.src.business-component.tag-trend.charts-options.sa0ejb96vk',
            { paramsAxisValue: paramsAxisValue, paramsValue: paramsValue }
          )
          .d('日期: {paramsAxisValue} <br/>空值数: {paramsValue}')
      },
      // formatter: params => `日期: ${params[0].axisValue} <br/>空值数: ${params[0].value}`,
      // formatter: params => `日期: ${moment(+params[0].axisValue).format('YYYY-MM-DD')} <br/>空值数: ${params[0].value}`,
    },

    xAxis: {
      type: 'category',
      data: _.map(data, 'date'),
      axisLabel: {
        // formatter: value => moment(+value).format('MM-DD'),
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

    yAxis: [
      {
        type: 'value',
        min: 0,
        splitNumber: 5,
        name: '',
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
