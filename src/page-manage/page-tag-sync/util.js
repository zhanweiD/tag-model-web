import intl from 'react-intl-universal'
import { Badge } from 'antd'

// 最后一次运行状态 0 运行中  1 成功  2 失败
export const getLastStatus = ({ status }, fn) => {
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

  return <Badge color={color} text={text} />
}

// 方案状态 0 未完成、1 提交成功 2 提交失败 3提交中 4更新成功 5更新失败 6更新中
export const getSyncStatus = ({ status }, fn) => {
  let color
  let text
  switch (+status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg')
        .d('未完成')
      break
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
    case 3:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.huk8rr9jxlj')
        .d('提交中')
      break
    case 4:
      color = '#87d068'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.0doda0qa0mh')
        .d('更新成功')
      break
    case 5:
      color = '#f50'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.xsc1gk9ooy')
        .d('更新失败')
      break
    case 6:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.kl5h1dt6a5o')
        .d('更新中')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg')
        .d('未完成')
      break
  }

  return <Badge color={color} text={text} />
}

// 调度类型 0暂停 1启动
export const getScheduleType = ({ status }, fn) => {
  let color
  let text
  switch (+status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-list.main.cbv22vdspwp')
        .d('暂停')
      break
    case 1:
      color = '#87d068'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-list.main.l5pr8jfpdt8')
        .d('启动')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-sync.sync-list.main.cbv22vdspwp')
        .d('暂停')
      break
  }

  return <Badge color={color} text={text} />
}

export const syncStatus = [
  // {
  //   name: '未完成',
  //   value: 0,
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
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.huk8rr9jxlj')
      .d('提交中'),
    value: 3,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.0doda0qa0mh')
      .d('更新成功'),
    value: 4,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.xsc1gk9ooy')
      .d('更新失败'),
    value: 5,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.kl5h1dt6a5o')
      .d('更新中'),
    value: 6,
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
