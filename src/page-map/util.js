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
  return ORDER_MAP[name] || ''
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
  // const radius = 120

  return {
    series: [{
      type: 'pie',
      // radius: [radius - 25, radius],
      // center: [radius + 10, radius + 20],
      radius: ['70%', '90%'],
      center: ['50%', '50%'],
      // center: [100, 100],
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

/**
 * @description 将打平的数组转换成层级结构，并返回第一层节点
 * @author 三千
 * @date 2019-08-13
 * @param {*} nodes 打平（都在同一级）的节点数组，一维数组，每个节点至少包含id、parentId两个属性
 * @returns 返回第一层节点数组
 */
export function listToTree(nodes = []) {
  if (!nodes.length) {
    return []
  }

  // 根节点（第一层节点）数组，要返回的结果
  const roots = []

  // 子节点数组集合
  const childrenMap = {}

  // 节点映射，用id 映射到 节点，避免重复遍历
  const nodeMap = {}
  
  // 根据parentId划分成不同数组，每个数组就对应不同parent节点的children
  nodes.forEach(node => {
    const {parentId, id} = node
    if (!childrenMap[parentId]) {
      childrenMap[parentId] = []
    }

    // 存入父节点的children数组中
    childrenMap[parentId].push(node)

    // 和id绑定
    nodeMap[id] = node
  })

  // 把childrenMap里的数组添加到对应的节点
  Object.keys(childrenMap).forEach(parentId => {
    // 有节点的id和这个parentId相等，说明不是根节点，那就赋值给对应节点的children属性
    if (nodes.some(node => +node.id === +parentId)) {
      nodeMap[parentId].children = childrenMap[parentId]
    } else { // 如果是第一层节点，存入根节点roots数组
      roots.push(...childrenMap[parentId])
    }
  })

  // 返回第一层节点
  return roots
}
