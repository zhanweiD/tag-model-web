const colorList = ['#39A0FF', '#36CBCB', '#4DCB73', '#FAD338', '#F2637B', '#9760E4']

// 标签枚举值分布图表配置
export default function getPieOpt(data = []) {
  return {
    series: [
      {
        name: '规则类型',
        type: 'pie',
        radius: ['50%', '65%'],
        center: ['35%', '55%'],
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
        data,
        itemStyle: {// 元素样式
          normal: {
            // 对每个颜色赋值 
            color: item => colorList[item.dataIndex],
          },
        },
      },
    ],
  }
}
