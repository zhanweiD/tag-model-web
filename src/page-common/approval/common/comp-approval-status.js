import intl from 'react-intl-universal'
/**
 * @description 审批状态组件
 */
import React from 'react'
import { Badge } from 'antd'

export const getTableStatus = ({ status }) => {
  let color
  let text
  switch (+status) {
    case 0:
      color = '#108ee9'
      text = intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
        )
        .d('审批中')
      break
    case 1:
      color = '#87d068'
      text = intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-modal.mf9x2yuz9r'
        )
        .d('审批通过')
      break
    case 2:
      color = '#f50'
      text = intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-status.xpk5ykezyb9'
        )
        .d('审批未通过')
      break
    case 3:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-modal.2uelr28l96w'
        )
        .d('已撤销')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-modal.2uelr28l96w'
        )
        .d('已撤销')
      break
  }

  return <Badge color={color} text={text} />
}

// 审批管理 - 申请类型
export const APPLY_TYPE = [
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-status.7w2tjfj53ix'
      )
      .d('授权使用'),
    value: 0,
  },

  // {
  //   name: '上架',
  //   value: 1,
  // }, {
  //   name: '下架',
  //   value: 2,
  // }
]

// 审批管理 - 申请状态
export const APPLY_STATUS = [
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
      )
      .d('审批中'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-common.approval.common.comp-approval-modal.mf9x2yuz9r')
      .d('审批通过'),
    value: 1,
  },
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-status.xpk5ykezyb9'
      )
      .d('审批未通过'),
    value: 2,
  },
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.2uelr28l96w'
      )
      .d('已撤销'),
    value: 3,
  },
]

// 审批管理 - 我的审批 申请状态搜索
export const APPROVAL_STATUS = [
  {
    name: intl
      .get('ide.src.page-common.approval.common.comp-approval-modal.mf9x2yuz9r')
      .d('审批通过'),
    value: 1,
  },
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-status.xpk5ykezyb9'
      )
      .d('审批未通过'),
    value: 2,
  },
]
