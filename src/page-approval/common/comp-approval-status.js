/**
 * @description 审批状态组件
 */
import React from 'react'
import {Badge} from 'antd'

export default ({status}) => {
  let color 
  let text
  switch (status) {
    case 0: color = '#108ee9'; text = '审核中'; break
    case 1: color = '#87d068'; text = '审核通过'; break
    case 2: color = '#f50'; text = '审核失败'; break
    case 3: color = '#d9d9d9'; text = '已撤销'; break
    default: color = '#d9d9d9'; text = '已撤销'; break
  }

  return <Badge color={color} text={text} />
}
