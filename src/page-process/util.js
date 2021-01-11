import intl from 'react-intl-universal'
import { Badge } from 'antd'

// 方案类型
export const schemeTypeMap = [
  {
    name: 'TQL',
    value: 1,
  },
]

// 方案状态 0 未完成、1 待提交、2 提交成功 3 提交失败
export const schemeStatusMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg')
      .d('未完成'),
    value: 0,
  },

  //  {
  //   name: '待提交',
  //   value: 1,
  // },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.yf96acx8evb')
      .d('提交成功'),
    value: 1,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.2n0b3tsdnkb')
      .d('提交失败'),
    value: 2,
  },
]

export const getSchemeStatus = ({ status }, fn) => {
  let color
  let text
  switch (+status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg')
        .d('未完成')
      break
    // case 1: color = '#108ee9'; text = '待提交'; break
    case 1:
      color = '#87d068'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.yf96acx8evb')
        .d('提交成功')
      break
    case 2:
      color = '#f50'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.2n0b3tsdnkb')
        .d('提交失败')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg')
        .d('未完成')
      break
  }

  // if (+status === 1 || +status === 2) {
  //   return <a href onClick={() => fn()}><Badge color={color} text={text} /></a>
  // }

  return <Badge color={color} text={text} />
}

export const getSchemeRunStatus = ({ status }, fn) => {
  let color
  let text
  switch (+status) {
    case 0:
      color = '#108ee9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.yoe34ygwt6e'
        )
        .d('运行中')
      break
    case 1:
      color = '#87d068'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.predyi8le4m'
        )
        .d('运行成功')
      break
    case 2:
      color = '#f50'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.ifoapcxe4mr'
        )
        .d('运行失败')
      break
    default:
      color = '#108ee9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.yoe34ygwt6e'
        )
        .d('运行中')
      break
  }

  // if (+status === 1 || +status === 1) {
  //   return <a href onClick={() => fn()}><Badge color={color} text={text} /></a>
  // }

  return <Badge color={color} text={text} />
}

// 调度类型 1周期调度 2手动执行
export const scheduleTypeMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-list.main.m121153o0vp')
      .d('周期调度'),
    value: 1,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.util.17pxvua4hny')
      .d('手动执行'),
    value: 2,
  },
]

// 调度类型 1周期调度 2手动执行
export const scheduleTypeObj = {
  1: intl
    .get('ide.src.page-manage.page-tag-sync.sync-list.main.m121153o0vp')
    .d('周期调度'),
  2: intl
    .get('ide.src.page-manage.page-tag-sync.util.17pxvua4hny')
    .d('手动执行'),
}

// 调度类型 1TQL
export const schemeTypeObj = {
  1: 'TQL',
}

export const cycleSelectMap = {
  day: intl
    .get('ide.src.page-manage.page-tag-sync.sync-detail.store.8ix9ytimdyp')
    .d('每天'),
  week: intl.get('ide.src.page-process.util.8zgtl28kqsi').d('每周'),
  month: intl.get('ide.src.page-process.util.5k119i8yd8t').d('每月'),
}
