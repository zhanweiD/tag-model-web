import {Badge} from 'antd'
// 使用状态
export const usedStatusMap = [{
  name: '未使用',
  value: 0,
}, {
  name: '使用中',
  value: 1,
}]

export const usedStatusBadgeMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '未使用'; break
    case 1: color = '#108ee9'; text = '使用中'; break
    default: color = '#d9d9d9'; text = '未使用'; break
  }

  return <Badge color={color} text={text} />
}

// 标签状态
export const tagStatusMap = [{
  name: '待配置',
  value: 0,
}, {
  name: '待发布',
  value: 1,
}, {
  name: '已发布',
  value: 2,
}]

export const tagStatusBadgeMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '待配置'; break
    case 1: color = '#FEBB00'; text = '待发布'; break
    case 2: color = '#52C41A'; text = '已发布'; break
    default: color = '#d9d9d9'; text = '待配置'; break
  }

  return <Badge color={color} text={text} />
}

// 公开状态
export const publishStatusMap = [{
  name: '下架',
  value: 0,
}, {
  name: '上架',
  value: 1,
}, {
  name: '下架审批中',
  value: 2,
}, {
  name: '上架审批中',
  value: 3,
}]

export const publishStatusBadgeMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '下架'; break
    case 1: color = '#108ee9'; text = '上架'; break
    case 2: color = '#0078FF '; text = '下架审批中'; break
    case 3: color = '#0078FF '; text = '上架审批中'; break
    default: color = '#d9d9d9'; text = '下架'; break
  }

  return <Badge color={color} text={text} />
}

// 标签配置方式 基础标签&统计
export const tagConfigMethodMap = [{
  name: '基础标签',
  value: 0,
}, {
  name: '统计',
  value: 1,
}]

// 标签配置方式 基础标签&统计
export const tagConfigMethodTableMap = {
  0: '基础标签',
  1: '统计',
}

// 名称类型映射: 1 中文名 2 英文名
export const nameTypeMap = {
  name: 1,
  enName: 2,
}
