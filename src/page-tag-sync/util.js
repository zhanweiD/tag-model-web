import {Badge} from 'antd'

// 最后一次运行状态 0 运行中  1 成功  2 失败
export const getLastStatus = ({status}, fn) => {
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

// 方案状态 0 未完成、1 提交成功 2 提交失败 3提交中 4更新成功 5更新失败 6更新中
export const getSyncStatus = ({status}, fn) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '未完成'; break
    case 1: color = '#87d068'; text = '提交成功'; break
    case 2: color = '#f50'; text = '提交失败'; break
    case 3: color = '#108ee9'; text = '提交中'; break
    case 4: color = '#87d068'; text = '更新成功'; break
    case 5: color = '#f50'; text = '更新失败'; break
    case 6: color = '#108ee9'; text = '更新中'; break
    default: color = '#d9d9d9'; text = '未完成'; break
  }

  return <Badge color={color} text={text} />
}

// 调度类型 0暂停 1启动
export const getScheduleType = ({status}, fn) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '暂停'; break
    case 1: color = '#87d068'; text = '启动'; break
    default: color = '#d9d9d9'; text = '暂停'; break
  }

  return <Badge color={color} text={text} />
}

export const syncStatus = [
  // {
  //   name: '未完成',
  //   value: 0,
  // }, 
  {
    name: '提交成功',
    value: 1,
  }, {
    name: '提交失败',
    value: 2,
  }, {
    name: '提交中',
    value: 3,
  }, {
    name: '更新成功',
    value: 4,
  }, {
    name: '更新失败',
    value: 5,
  }, {
    name: '更新中',
    value: 6,
  }]
