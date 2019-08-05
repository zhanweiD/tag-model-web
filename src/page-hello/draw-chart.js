import * as d3 from 'd3'
import { calcSize } from '../common/util'

// ruleType     1:记录波动2:每日新增存储量3:总存储量4:字段规范性5:字段值 ,  如果是  每日新增存储量, 总存储量. 需要装换单位 

// 图标区域 边界距离 24
const marginLeft = 50
const marginRight = 100
const marginTop = 60
// 柱子的宽度
const barWidth = 24
// 柱子之间的间距
const padding = 10
// 右侧报警提示的宽高
const polylineWidth = 40
const polylineHeight = 16

const el = document.createElement('div')
el.id = 'tip'
el.classList.add('tooltip')
document.body.appendChild(el)

d3.tooltipShow = content => {
  el.innerHTML = content
  el.style.top = `${d3.event.pageY}px`
  el.style.left = `${d3.event.pageX + 10}px`
  el.classList.toggle('fadeIn', true)
}

function myToFixed(num) {
  const number = num * 100
  if (isNaN(number)) return num
  return Math.round(number, 0) / 100
}
// 按顺序排列 从数据中选出 compareName  todayName  fluctuateName
const colors = d3.scaleOrdinal()
                  .range(['#8996E7', '#31B8F5', '#666'])
                  .domain(['compareName', 'todayName', 'fluctuateName'])

function initChart(svg, data, isTable) {
  data.firstValue = +data.firstValue
  data.secondValue = +data.secondValue
  const width = svg.clientWidth
  const height = svg.clientHeight
  // 告警方式 trendType  1:绝对值  2:上升  3:下降
  // compareType   对比方式1:大于2:小于3:介于4:等于5:不等于
  const isUseSecondValue = data.compareType === 3
  const compareType = data.compareType
  const trendType = data.trendType
  // 这种情况需要转换 单位
  const isCalcSize = data.ruleType === 2 || data.ruleType === 3
  // 找出记录条数中的最大值
  const standardValueExtent = d3.extent(data.itemList, o => +o.standardValue)
  const resultValueExtent = d3.extent(data.itemList, o => +o.resultValue)
  const maxValue = d3.max(standardValueExtent.concat(resultValueExtent))
  let domain = [0, maxValue]
  if (!isTable) {
    const minValue = d3.min(standardValueExtent.concat(resultValueExtent))
    if (minValue < 0) {
      domain = [minValue, maxValue]
    } else {
      isTable = true
    }
  }
  
  
  // 找出波动系数中的最大值 最小值
  const listExtentValue = d3.extent(data.itemList, o => +o.fluctuateValue)
  listExtentValue.push(data.firstValue)
  // 如果是介于的告警方式，就要将secondValue放入
  if (isUseSecondValue) listExtentValue.push(data.secondValue)
  let lineExtentValue = d3.extent(listExtentValue)
  // 如果是绝对值模式
  if (trendType === 1) {
    const max = d3.max(lineExtentValue, item => Math.abs(item))
    lineExtentValue = [-max, max]
  }
  svg = d3.select(svg)
  const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`)
  // 定义x轴 比例尺
  const x = d3.scaleBand()
              .rangeRound([0, width - marginLeft - marginRight])
              .padding(0.5)
              .domain(data.itemList.map(o => o.recordTime))
  // 定义y轴 比例尺 记录条数 当为表监控时，domain ［0 －> Max］但是当我字段监控的时候，有可能出线负的
  const y1 = d3.scaleLinear()
              .range([height - (2 * marginTop), 0])
              .domain(domain)
              .nice()
  
  // 定义右侧y轴 比率 扩大0.2，当类型为绝对值时，要注意domain
  const y2 = d3.scaleLinear()
              .range([height - (2 * marginTop), 0])
              .domain([lineExtentValue[0] - 0.2 * Math.abs(lineExtentValue[0]), lineExtentValue[1] + 0.2 * Math.abs(lineExtentValue[1])])
              .nice()
  // x 轴
  const xAxis = d3.axisBottom(x)
                  .tickSize(0)
  // 左侧y轴
  const yAxisLeft = d3.axisLeft(y1)
                      .tickSize(marginRight + marginLeft - width)
                      
  
  if (isCalcSize) {
    yAxisLeft.tickFormat(d => calcSize(d, 'B', false))
  } 
  // function calcFormatValue() {

  // }                   
  // 右侧y轴 
  const yAxisRight = d3.axisRight(y2)
                      .tickSize(0)
                      // .ticks(8)
                      .tickFormat(d => `${d}%`)
  // // 折线
  const line = d3.line()
                // 有了这个，就可以让，不生效的数据出现断点
                .defined(d => d.fluctuateValueExist)
                .x(d => x(d.recordTime) + x.bandwidth()/2 + padding + barWidth/2)
                .y(d => y2(d.fluctuateValue))
                .curve(d3.curveMonotoneX)
  // x 轴样式
  function custoXaxis(gg) {
    gg.select('.domain').remove()
    gg.selectAll('text')
      .attr('fill', 'rgba(0,0,0,0.6)')
      .attr('dy', '1.5em')
  }
  // 左侧y 轴样式
  function custoYaxis(gg) {
    gg.select('.domain').remove()
    gg.selectAll('text').attr('fill', 'rgba(0,0,0,0.6)')
    gg.selectAll('line').attr('stroke', '#e9e9e9')
  }
  // add x
  g.append('g')
    .attr('transform', `translate(0, ${height - (2 * marginTop)})`)
    .attr('fill', 'rgba(0,0,0,0.43)')
    .call(xAxis)
    .call(custoXaxis)

  // 将左侧y轴放到左侧
  g.append('g')
    .call(yAxisLeft)
    .call(custoYaxis)
  .append('text')
    .attr('class', 'label')
    .text(data.todayName)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(0,0,0,.6)')
    .attr('dy', -20)
    .attr('dx', -22)
  
  // 画告警辅助线
  function drawMontiorLine(monitorValue) {
    // monitorValue 为比率值，要转换成真实值
    const node = g.append('g')
    const translateWidth = (width - marginLeft - marginRight) + 40
    const points = `0 ${polylineHeight/2},8 0, ${polylineWidth} 0, ${polylineWidth} ${polylineHeight}, 8 ${polylineHeight},0 ${polylineHeight/2}`
    // 辅助线
    node.append('line')
        .attr('x1', 0)
        .attr('y1', y2(monitorValue))
        .attr('x2', 0)
        .transition()
        .duration(1000)
        .attr('x2', translateWidth)
        .attr('y2', y2(monitorValue))
        .style('stroke-width', 1)
        .style('stroke', '#FF5500')
        .style('stroke-dasharray', '3')
    // 标志
    const mark = node.append('g')
                    .attr('transform', `translate(${translateWidth}, ${y2(monitorValue) - polylineHeight/2})`)
                    .on('mouseover', () => d3.tooltipShow(`告警阈值${monitorValue}%`))
                    .on('mousemove', d3.tooltipMove)
                    .on('mouseout', d3.tooltipHide)
    mark.append('polyline')
        .attr('fill', '#FF5500')
        .attr('points', points)
    mark.append('text')
        .attr('x', 8)
        .attr('y', 14)
        .attr('dx', 1)
        .attr('dy', -1)
        .attr('fill', '#fff')
        .attr('font-size', '12px')
        .text(`${monitorValue}%`)
  }

  // 告警方式 trendType  1:绝对值  2:上升  3:下降
  // compareType   对比方式1:大于2:小于3:介于4:等于5:不等于
  // 这里画告警区域要根据这两个值来判断
 
  function drawMontiorArea(y, areaHeight) {
    g.append('rect')
      .attr('class', 'montior-area')
      .attr('width', width - marginLeft - marginRight)
      .attr('x', 0)
      .attr('height', 0)
      .attr('y', y)
      .transition()
      .duration(650)
      .attr('height', areaHeight)
      .attr('fill', 'rgba(255,85,0,0.2)')
  }
  // 不等于的时候，不能全红，要在警戒线下面弄个白色
  function drawWhiteLine(value) {
    g.append('line')
      .attr('x1', 0)
      .attr('y1', y2(value))
      .attr('x2', 0)
      .transition()
      .duration(1000)
      .attr('x2', (width - marginLeft - marginRight) + 40)
      .attr('y2', y2(value))
      .style('stroke-width', 1)
      .style('stroke', '#FFF')
  }
  // 计算画告警区域
  if (compareType === 1) {
    // 大于告警 firstValue
    drawMontiorArea(0, y2(data.firstValue))
    // 绝对值类型
    if (trendType === 1) {
      drawMontiorArea(y2(-data.firstValue), height - 2 * marginTop - y2(-data.firstValue))
    }
  } else if (compareType === 2) {
    // 小于 firstValue
    if (trendType !== 1) {
      // 非绝对值
      drawMontiorArea(y2(data.firstValue), height - y2(data.firstValue) - 2 * marginTop)
    } else {
      // 绝对值
      drawMontiorArea(y2(data.firstValue), y2(-data.firstValue) - y2(data.firstValue))
    }
  } else if (compareType === 3) {
    // 介于 firstValue secondValue
    const maxV = d3.max([data.firstValue, data.secondValue])
    drawMontiorArea(y2(maxV), Math.abs(y2(data.firstValue) - y2(data.secondValue)))
    if (trendType === 1) {
      // 绝对值
      const minV = d3.min([data.firstValue, data.secondValue])
      drawMontiorArea(y2(-minV), Math.abs(y2(data.firstValue) - y2(data.secondValue)))
    }
  } else if (compareType === 4) {
    // 等于，就不用 就随便画个2px
    drawMontiorArea(y2(data.firstValue), 2)
    if (trendType === 1) {
      drawMontiorArea(y2(-data.firstValue), 2)
    }
  } else if (compareType === 5) {
    // 不等于
    drawMontiorArea(0, height - 2 * marginTop)
    drawWhiteLine(data.firstValue)
    if (trendType === 1) {
      drawWhiteLine(-data.firstValue)
    }
  }
  drawMontiorLine(data.firstValue)
  // 介于
  if (isUseSecondValue) drawMontiorLine(data.secondValue)
  // 绝对值
  if (trendType === 1) {
    drawMontiorLine(-data.firstValue)
    if (isUseSecondValue) drawMontiorLine(-data.secondValue)
  }
  // 将右侧y轴放入右侧
  g.append('g')
    .attr('transform', `translate(${width - marginRight - marginLeft}, 0)`)
    .call(yAxisRight)
    .call(custoYaxis)
  .append('text')
    .attr('class', 'label')
    .text(data.fluctuateName)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(0,0,0,.6)')
    .attr('dy', -20)
    .attr('dx', 22)

  // 判断是否报警了
  function isAlarm(fluctuateValue) {
    let alarm = false
    if (compareType === 1) {
      // 大于告警 firstValue
      alarm = fluctuateValue > data.firstValue
      if (trendType === 1) {
        alarm = Math.abs(fluctuateValue) > data.firstValue
      }
      
    } else if (compareType === 2) {
      // 小于 firstValue
      alarm = fluctuateValue < data.firstValue
      if (trendType === 1) {
        alarm = Math.abs(fluctuateValue) < data.firstValue
      }
    } else if (compareType === 3) {
      // 介于 firstValue secondValue
      const arr = d3.extent([data.firstValue, data.secondValue])
      alarm = fluctuateValue >= arr[0] && fluctuateValue <= arr[1]
      if (trendType === 1) {
        alarm = Math.abs(fluctuateValue) >= arr[0] && Math.abs(fluctuateValue) <= arr[1]
      }
    } else if (compareType === 4) {
      // 等于，
      alarm = fluctuateValue === data.firstValue
      if (trendType === 1) {
        alarm = Math.abs(fluctuateValue) === data.firstValue
      }
    } else {
      // 不等于
      alarm = fluctuateValue !== data.firstValue
      if (trendType === 1) {
        alarm = Math.abs(fluctuateValue) !== data.firstValue
      }
    }
    return alarm
  }
  // 提示
  function getToolTip(d) {
    const html = `时间：${d.recordTime}<br />
      ${data.compareName}：${d.standardValueExist ? isCalcSize ? calcSize(d.standardValue) : myToFixed(d.standardValue) : '暂无数据'}<br />
      ${data.todayName}：${d.resultValueExist ? isCalcSize ? calcSize(d.resultValue) : myToFixed(d.resultValue) : '暂无数据'}<br />
      ${data.fluctuateName}：<span class="${isAlarm(d.fluctuateValue) ? 'alarm' : 'normal'}">${d.fluctuateValueExist ? `${d.fluctuateValue}%` : '暂无数据'}</span>`
    return d3.tooltipShow(html)
  }

  function bar1(dom) {
    // 插入rect bar 每个点上有两个bar 这是第一个bar 中心左偏移
    dom.append('rect')
      .attr('class', 'bar')
      .attr('x',  - (padding + barWidth))
      .attr('width', barWidth)
      .attr('y', y1(0))
      .transition()
      .duration(650)
      .attr('y', d => {
        if (d.standardValue < 0) {
          return y1(0)
        }
        return y1(d.standardValue)
      })
      // .attr('y', d => y1(d.standardValue))
      .attr('height', d => Math.abs(y1(d.standardValue) - y1(0)))
      .attr('fill', colors('compareName'))
    dom.append('text')
      .attr('x', - (padding + barWidth/2))
      .attr('y', d => {
        if (d.standardValueExist) {
          if (d.standardValue < 0) {
            return y1(0)
          }
          return y1(d.standardValue)
        }
        return y1(0)        
      })
      .attr('dx', -2)
      .attr('dy', -2)
      .attr('font-size', '10px')
      .attr('fill', 'rgba(0,0,0,.6)')
      .attr('text-anchor', 'end')
      .text(d => {
        if (d.standardValueExist) {
          return isCalcSize ? calcSize(d.standardValue) : myToFixed(d.standardValue)
        }
        return '暂无数据'
      })
  }
  function bar2(dom) {
    // 插入rect bar 每个点上有两个bar 这是第二个bar中心右偏移
    dom.append('rect')
      .attr('class', 'bar')
      .attr('x', padding)
      .attr('width', barWidth)
      .attr('y', y1(0))
      .transition()
      .duration(650)
      .attr('y', d => {
        if (d.resultValue < 0) {
          return y1(0)
        }
        return y1(d.resultValue)
      })
      .attr('height', d => Math.abs(y1(d.resultValue) - y1(0)))
      .attr('fill', colors('todayName'))
    dom.append('text')
      .attr('x', padding + barWidth/2)
      .attr('y', d => {
        if (d.resultValueExist) {
          if (d.resultValue < 0) {
            return y1(0)
          }
          return y1(d.resultValue)
        }
        return y1(0)        
      })
      .attr('dx', -2)
      .attr('dy', -2)
      .attr('font-size', '10px')
      .attr('fill', 'rgba(0,0,0,.6)')
      .attr('text-anchor', '')
      .text(d => {
        if (d.resultValueExist) {
          return isCalcSize ? calcSize(d.resultValue) : myToFixed(d.resultValue)
        }
        return '暂无数据'
      })
  }

  g.selectAll('.bar')
    .data(data.itemList)
  .enter().append('g')
    .attr('class', 'bar-box')
    .attr('transform', d => `translate(${x(d.recordTime) + x.bandwidth()/2}, 0)`)
    .on('mouseover', getToolTip)
    .on('mousemove', d3.tooltipMove)
    .on('mouseout', d3.tooltipHide)
    .call(bar1)
    .call(bar2)
  
  // 图的视例 颜色区分label
  const lengend = d3.scaleLinear()
                    .range([0, width - marginLeft - marginRight])
                    .domain([0, 12])
  const lengendContent = g.append('g')
                          .attr('transform', `translate(0, ${height - marginTop - 10})`)
  const betweenWidth = {
    4: -110,
    6: 0,
    8: 110,
  }
  function drawLabel(name, color, i) {
    const labelG = lengendContent.append('g')
                                  .attr('transform', `translate(${lengend(6) + betweenWidth[i]}, 0)`)
    // labelG.append('circle')
    //       .attr('class', 'legend')
    //       .attr('cx', -6)
    //       .attr('cy', -1)
    //       .attr('r', 4)
    //       .attr('fill', color)
    labelG.append('rect')
          .attr('class', 'legend')
          .attr('x', -16)
          .attr('y', -7)
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', color)

    labelG.append('text')
          .attr('font-size', '12px')
          .attr('dx', 3)
          .attr('dy', 3)
          .attr('fill', 'rgba(0,0,0,.6)')
          .text(name)
  }
  drawLabel(data.compareName, colors('compareName'), 4)
  drawLabel(data.todayName, colors('todayName'), 6)
  drawLabel(data.fluctuateName, colors('fluctuateName'), 8)
  
  // 生成折现
  const lineG = g.append('g')
                  .datum(data.itemList)
  lineG.append('path')
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke-width', '1.5px')
    .attr('stroke', colors('fluctuateName'))
    .attr('fill', 'none')
  // 折线上的点
  lineG.selectAll('.dot')
    .data(data.itemList.filter(item => item.fluctuateValueExist))
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', d => {
      return isAlarm(d.fluctuateValue) ? 6 : 4
    })
    .attr('fill', d => {
      return isAlarm(d.fluctuateValue) ? '#FF5500' : colors('fluctuateName')
    })
    // .attr('stroke', d => {
    //   return isAlarm(d.fluctuateValue) ? '#FF5500' : colors('fluctuateName')
    // })
    .on('mouseover', getToolTip)
    .on('mousemove', d3.tooltipMove)
    .on('mouseout', d3.tooltipHide)
} 

export default initChart
