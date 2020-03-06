import {Badge} from 'antd'

// 方案类型
export const schemeTypeMap = [{
  name: 'TQL',
  value: 1,
}]
// 方案状态 0 未完成、1 待提交、2 提交成功 3 提交失败
export const schemeStatusMap = [{
  name: '未完成',
  value: 0,
}, {
  name: '待提交',
  value: 1,
}, {
  name: '提交成功',
  value: 2,
}, {
  name: '提交失败',
  value: 3,
}]

export const getSchemeStatus = ({status}) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '未完成'; break
    case 1: color = '#108ee9'; text = '待提交'; break
    case 2: color = '#87d068'; text = '提交成功'; break
    case 3: color = '#f50'; text = '提交失败'; break
    default: color = '#d9d9d9'; text = '未完成'; break
  }

  return <Badge color={color} text={text} />
}

export const getSchemeRunStatus = ({status}) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#108ee9'; text = '运行中'; break
    case 1: color = '#87d068'; text = '运行成功'; break
    case 2: color = '#f50'; text = '运行失败'; break
    default: color = '#108ee9'; text = '运行中'; break
  }

  return <Badge color={color} text={text} />
}

// 调度类型 1周期调度 2手动执行
export const scheduleTypeMap = [{
  name: '周期调度',
  value: 1,
}, {
  name: '手动执行',
  value: 2,
}]

// 调度类型 1周期调度 2手动执行
export const scheduleTypeObj = {
  1: '周期调度',
  2: '手动执行',
} 

// 调度类型 1TQL
export const schemeTypeObj = {
  1: 'TQL',
} 
