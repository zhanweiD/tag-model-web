import intl from 'react-intl-universal'

const colors = [
  'rgba(0,197,122, 0.6)',
  'rgba(10,192,220, 0.6)',
  'rgba(57,167,255, 0.6)',
  'rgba(90,106,254, 0.6)',
  'rgba(149,51,255, 0.6)',
]

const nameTextStyleColor = 'rgba(0, 0, 0, .45)'

function randomColor() {
  const r = () => Math.floor(Math.random() * 256)
  return `rgb(${r()},${r()},${r()})`
}

function getColors(len) {
  if (len > 5) {
    randomColor()
    return [...Array(100)].map(() => randomColor())
  }
  return colors
}

// 标签调用次数趋势图配置
export function getTagTrendOpt(data, legend = []) {
  const colorList = getColors(legend.length)

  const series = legend.length
    ? legend.map(name => ({
      name,
      type: 'line',
      symbol: 'none',
      // smooth: 0.3,
      data: _.map(data, d => {
        const obj = d.data.filter(i => i.name === name)[0] || {}
        return obj.invokeCount || 0
      }),
    }))
    : [
      {
        name: 'noData',
        type: 'line',
        symbol: 'none',
        // smooth: 0.3,
        data: _.map(data, () => 0),
      },
    ]

  return {
    grid: {
      containLabel: true,
      x: 10,
      y: 30,
      x2: 10,
      y2: legend.length ? 30 : 0,
    },

    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const paramAxisValue = +params[0].axisValue
        const paramsDataIndex = data[+params[0].dataIndex].totalCount
        const domArr = [
          intl
            .get(
              'ide.src.business-component.tag-analyze.charts-options.r0istg1b29l',
              {paramsDataIndex}
            )
            .d('日期:  <br/>总调用次数: {paramsDataIndex}<br/>'),
        ]
        if (legend.length) {
          params.map((item, idx) => domArr.push(
            `${params[idx].marker} ${params[idx].seriesName}: ${params[idx].data} <br/>`
          ))
        }
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
        name: intl
          .get(
            'ide.src.business-component.tag-analyze.charts-options.ycq3eg2bn5f'
          )
          .d('标签调用次数'),
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

    color: colorList,
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
      y2: 0,
    },

    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const axisValue = +params[0].axisValue
        const paramsValue = +params[0].value
        return intl
          .get(
            'ide.src.business-component.tag-analyze.charts-options.ef7k0b41v1v',
            {paramsValue}
          )
          .d('日期:  <br/>空值数: {paramsValue}')
      },
      // formatter: params => `日期: ${moment(+params[0].axisValue).format('YYYY-MM-DD')} <br/>空值数: ${params[0].value}`,
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

// 值域分布图配置
export function getPieOpt(chartsCount, data) {
  return {
    backgroundColor: '#fff',
    title: {
      text: intl
        .get(
          'ide.src.business-component.tag-analyze.charts-options.t4m39f4vn7l'
        )
        .d('总计'),
      subtext: intl
        .get(
          'ide.src.business-component.tag-analyze.charts-options.2utgfv4u6kl',
          {chartsCount}
        )
        .d('{chartsCount}个'),
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 30,
        fontWeight: 'normal',
        color: ['#333'],
      },

      subtextStyle: {
        color: '#666',
        fontSize: 16,
      },
    },

    tooltip: {
      formatter: params => {
        const info = params.name.split(' ')
        return intl
          .get(
            'ide.src.business-component.tag-analyze.charts-options.28atjkrczpj',
            {infoName: info[0], infoPro: info[1], infoCount: info[2]}
          )
          .d(
            '标签名称: {infoName}<br />标签占比: {infoPro}<br />标签数量: {infoCount}'
          )
      },
    },

    legend: {
      orient: 'vertical',
      x: '70%',
      y: 'center',
      itemWidth: 20,
      itemHeight: 20,
      align: 'left',
      textStyle: {
        fontSize: 12,
        color: '#333',
      },

      data: [],
    },

    series: [
      {
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['50%', '50%'],
        color: colors,
        data,
        labelLine: {
          normal: {
            show: false,
            length: 20,
            length2: 20,
            lineStyle: {
              color: '#12EABE',
              width: 2,
            },
          },
        },

        label: {
          normal: {
            show: false,
            formatter: '{c|{c}}\n{hr|}\n{d|{d}%}',
            rich: {
              b: {
                fontSize: 20,
                color: '#12EABE',
                align: 'left',
                padding: 4,
              },

              hr: {
                borderColor: '#12EABE',
                width: '100%',
                borderWidth: 2,
                height: 0,
              },

              d: {
                fontSize: 20,
                color: '#fff',
                align: 'left',
                padding: 4,
              },

              c: {
                fontSize: 20,
                color: '#fff',
                align: 'left',
                padding: 4,
              },
            },
          },
        },
      },
    ],
  }
}
