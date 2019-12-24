/**
 * @description 审批状态组件
 */
import React from 'react'
import {Badge} from 'antd'

export const getTableStatus = ({status}) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#108ee9'; text = '审核中'; break
    case 1: color = '#87d068'; text = '审核通过'; break
    case 2: color = '#f50'; text = '审核失败'; break
    case 3: color = '#d9d9d9'; text = '已撤销'; break
    default: color = '#d9d9d9'; text = '已撤销'; break
  }

  return <Badge color={color} text={text} />
}


// 审批管理 - 申请类型
export const APPLY_TYPE = [{
  name: '授权使用',
  value: 0,
}, {
  name: '上下架',
  value: 1,
}]

// 审批管理 - 申请状态
export const APPLY_STATUS = [{
  name: '审核中',
  value: 0,
}, {
  name: '审核通过',
  value: 1,
}, {
  name: '审核失败',
  value: 2,
}, {
  name: '已撤销',
  value: 3,
}]

// 审批管理 - 我的审批 申请状态搜索
export const APPROVAL_STATUS = [{
  name: '审核通过',
  value: 1,
}, {
  name: '审核失败',
  value: 2,
}]
